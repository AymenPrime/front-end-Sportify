import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Import useEffect
import './teams.css';


const TeamsList = ({teams}) => {
    if (teams.length === 0) {
      return (
        <div className="no-matches">
          <h1>No teams available.</h1>
        </div>
      );
    }
}

export default function TeamsPage({ isAdmin, onLogout }) {

    
    const navigate = useNavigate();
    const [teamData, setTeamData] = useState({
        teamName: '',
        players: Array(7).fill('')
    });

    const [teams, setTeams] = useState([]);
    const [teamStats, setTeamStats] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [showStatsForm, setShowStatsForm] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    // Fetch teams data when the component mounts
    useEffect(() => {
        fetchTeams();
    }, []);

    // Function to fetch teams data
    const fetchTeams = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/teams', {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch teams");
            }
    
            const data = await response.json();
            console.log("Fetched teams data:", data); // Debugging step
            
            if (Array.isArray(data)) {
                setTeams(data);
            } else if (data.data && Array.isArray(data.data)) {
                setTeams(data.data); // If teams are inside a "data" object
            } else {
                setTeams([]); // Default to an empty array to avoid map errors
            }
    
            // Initialize stats for each team
            const stats = {};
            (data.data || data).forEach(team => {
                stats[team.teamName] = { matchesPlayed: 0, wins: 0, loses: 0, draws: 0 };
            });
            setTeamStats(stats);
        } catch (error) {
            console.error("Error fetching teams:", error);
            setTeams([]); // Ensure teams is always an array
        }
    };

    function handleClickTeams() {
        navigate('/teams');
    }
    function handleClickMatches() {
        navigate('/matches');
    }
    function handleClickTables() {
        navigate('/tables');
    }
    function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        onLogout();
        navigate('/login');
    }

    function handleChange(event, index) {
        const { value } = event.target;
        if (index === -1) {
            setTeamData(prev => ({ ...prev, teamName: value }));
        } else {
            setTeamData(prev => {
                const updatedPlayers = [...prev.players];
                updatedPlayers[index] = value;
                return { ...prev, players: updatedPlayers };
            });
        }
    }

    async function handleSubmit() {
        if (!teamData.teamName || teamData.players.some(player => player.trim() === '')) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/teams/create/', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(teamData)
            });

            if (!response.ok) {
                throw new Error("Failed to create team");
            }

            // Fetch updated teams data after creating a new team
            await fetchTeams();
            setTeamData({ teamName: '', players: Array(7).fill('') });
            setShowForm(false);
        } catch (error) {
            console.error("Error creating team:", error);
            alert("Failed to create team. Please try again.");
        }
    }

    function handleCancel() {
        setShowForm(false);
    }

    function handleAddStats(teamName) {
        setSelectedTeam(teamName);
        setShowStatsForm(true);
    }

    function handleStatsSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const matchesPlayed = parseInt(formData.get('matchesPlayed'), 10);
        const wins = parseInt(formData.get('wins'), 10);
        const loses = parseInt(formData.get('loses'), 10);
        const draws = parseInt(formData.get('draws'), 10);

        setTeamStats(prevStats => ({
            ...prevStats,
            [selectedTeam]: {
                matchesPlayed: prevStats[selectedTeam].matchesPlayed + matchesPlayed,
                wins: prevStats[selectedTeam].wins + wins,
                loses: prevStats[selectedTeam].loses + loses,
                draws: prevStats[selectedTeam].draws + draws
            }
        }));
        setShowStatsForm(false);
    }

    function handleStatsCancel() {
        setShowStatsForm(false);
    }

    async function handleRemoveTeam(teamName) {
        try {
            const response = await fetch(`http://localhost:8000/api/teams/delete/${teamName}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete team");
            }

            // Fetch updated teams data after deleting a team
            await fetchTeams();
        } catch (error) {
            console.error("Error deleting team:", error);
            alert("Failed to delete team. Please try again.");
        }
    }

    return (
        <>
            <div className="content-teams">
                <div className="container-teams">
                    <header className='header'>
                        <h2 className='logo'>Sportify</h2>
                        <div className='nav'>
                            <ul>
                                <li onClick={handleClickTeams}>Teams</li>
                                <li onClick={handleClickMatches}>Matches</li>
                                <li onClick={handleClickTables}>Tables</li>
                            </ul>
                        </div>
                        {isAdmin && (
                            <button className="button-4" role="button" onClick={handleLogout}>Logout</button>
                        )}
                    </header>
                    <div className='teams-section'>
                        <div className="teams-header">
                            <h1>Our Teams</h1>
                            {!showForm && isAdmin && (
                                <button className="button-4" role="button" onClick={() => setShowForm(true)}>
                                    +
                                </button>
                            )}
                        </div>
                        {showForm && <div className="overlay" onClick={handleCancel}></div>}

                        <div className={`form-popup ${showForm ? "show" : 'hide'}`}>
                            <div className="form">
                                <div className="title">Create a Team</div>
                                <div className="subtitle">Let's create a team</div>

                                <div className="input-container ic1">
                                    <input id="firstname" className="input" type="text" placeholder="Name of the Team"
                                        value={teamData.teamName}
                                        onChange={(e) => handleChange(e, -1)}
                                    />
                                </div>

                                <div className="input-row">
                                    <div className="input-container ic2">
                                        <input id="input1" className="input" type="text" placeholder="Player 1"
                                            value={teamData.players[0]}
                                            onChange={(e) => handleChange(e, 0)}
                                        />
                                    </div>
                                    <div className="input-container ic2">
                                        <input id="input2" className="input" type="text" placeholder="Player 2"
                                            value={teamData.players[1]}
                                            onChange={(e) => handleChange(e, 1)}
                                        />
                                    </div>
                                    <div className="input-container ic2">
                                        <input id="input3" className="input" type="text" placeholder="Player 3"
                                            value={teamData.players[2]}
                                            onChange={(e) => handleChange(e, 2)}
                                        />
                                    </div>
                                </div>

                                <div className="input-row">
                                    <div className="input-container ic2">
                                        <input id="input4" className="input" type="text" placeholder="Player 4"
                                            value={teamData.players[3]}
                                            onChange={(e) => handleChange(e, 3)}
                                        />
                                    </div>
                                    <div className="input-container ic2">
                                        <input id="input5" className="input" type="text" placeholder="Player 5"
                                            value={teamData.players[4]}
                                            onChange={(e) => handleChange(e, 4)}
                                        />
                                    </div>
                                    <div className="input-container ic2">
                                        <input id="input6" className="input" type="text" placeholder="Player 6"
                                            value={teamData.players[5]}
                                            onChange={(e) => handleChange(e, 5)}
                                        />
                                    </div>
                                </div>

                                <div className="input-row">
                                    <div className="input-container ic2">
                                        <input id="input7" className="input" type="text" placeholder="Player 7"
                                            value={teamData.players[6]}
                                            onChange={(e) => handleChange(e, 6)}
                                        />
                                    </div>
                                </div>

                                <div className="button-row">
                                    <button type="button" className="submit" onClick={handleSubmit}>Submit</button>
                                    <button type="button" className="cancel" onClick={handleCancel}>Cancel</button>
                                </div>
                            </div>
                        </div>

                        {showStatsForm && <div className="overlay" onClick={handleStatsCancel}></div>}

                        <div className={`form-popup ${showStatsForm ? "show" : 'hide'}`}>
                            <div className="form">
                                <div className="title">Update Stats</div>
                                <div className="subtitle">For {selectedTeam}</div>
                                <form onSubmit={handleStatsSubmit}>
                                    <div className="input-container ic1">
                                        <input id="matchesPlayed" className="input" type="number" placeholder="Matches Played" name="matchesPlayed" required />
                                    </div>
                                    <div className="input-container ic1">
                                        <input id="wins" className="input" type="number" placeholder="Wins" name="wins" required />
                                    </div>
                                    <div className="input-container ic1">
                                        <input id="loses" className="input" type="number" placeholder="Loses" name="loses" required />
                                    </div>
                                    <div className="input-container ic1">
                                        <input id="draws" className="input" type="number" placeholder="Draws" name="draws" required />
                                    </div>
                                    <div className="button-row">
                                        <button type="submit" className="submit">Update</button>
                                        <button type="button" className="cancel" onClick={handleStatsCancel}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="teams-grid">
                            {teams.map((team, index) => (
                                <TeamCard
                                    key={index}
                                    team={team}
                                    stats={teamStats[team.teamName]}
                                    onAddStatsClick={() => handleAddStats(team.teamName)}
                                    onRemoveClick={() => handleRemoveTeam(team.teamName)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <TeamsList teams={teams}/>
        </>
    );
}

function TeamCard({ team, stats, onAddStatsClick, onRemoveClick }) {
    const [showPlayersModal, setShowPlayersModal] = useState(false);

    const players = team.players.map(name => ({
        name,
        goals: Math.floor(Math.random() * 10),
        assists: Math.floor(Math.random() * 5),
        yellowCards: Math.floor(Math.random() * 3),
        redCards: Math.floor(Math.random() * 2)
    }));

    return (
        <div className="team-card">
            <button className="remove-button" onClick={onRemoveClick}>×</button>
            <img alt='' src={`https://api.dicebear.com/9.x/bottts/avif?seed=${team.teamName}`} height="100px" />
            <h3>{team.teamName}</h3>
            <p>Matches Played: {stats.matchesPlayed}</p>
            <p>Wins: {stats.wins}</p>
            <p>Loses: {stats.loses}</p>
            <p>Draws: {stats.draws}</p>
            <div className='card-btn'>
                <button className="button-4" onClick={() => setShowPlayersModal(true)}>Players</button>
                <button className="button-4" onClick={onAddStatsClick}>Add Stats</button>
            </div>
            {showPlayersModal && (
                <PlayersModal players={players} onClose={() => setShowPlayersModal(false)} />
            )}
        </div>
    );
}

function PlayersModal({ players, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Players</h2>
                <div className="players-grid">
                    {players.map((player, index) => (
                        <PlayerCard key={index} player={player} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function PlayerCard({ player }) {
    return (
        <div className="player-card">
            <img alt='' src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${player.name}`} />
            <h4>{player.name}</h4>
            <p>Goals: {player.goals}</p>
            <p>Assists: {player.assists}</p>
            <p>Yellow Cards: {player.yellowCards}</p>
            <p>Red Cards: {player.redCards}</p>
        </div>
    );
}