import { useNavigate } from "react-router";
import { useState, useEffect } from 'react';
import './land.css';

import videoSource from '../assets/background-video.mp4';
import InstaIcon from '../components/InstaIcon';
import LinkIcon from '../components/LinkIcon';

export default function LandingPage({ isAdmin, onLogout }) {
    const navigate = useNavigate();
    const [showPlayerForm, setShowPlayerForm] = useState(false);
    const [playerData, setPlayerData] = useState({
        first_name: '',
        last_name: '',
        login: ''
    });
    const [isPlayerRegistered, setIsPlayerRegistered] = useState(false); // New state to track player registration
    useEffect(() => {
        const check_auth = () => {
            const access_token = localStorage.getItem("accessToken");
            const refresh_token = localStorage.getItem("refreshToken");
            if (access_token == undefined || refresh_token == undefined) {
                navigate('/login');
            }
        }
        const checkPlayerStatus = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/players/me/', {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                    },
                });
                
                if (!response.ok) {
                    throw new Error("Failed to fetch player status");
                }
                
                const data = await response.json();
                console.log(data)
                // if (data.is_player == 'true') {
                //     setIsPlayerRegistered(true)
                // }
                // else {
                //     setIsPlayerRegistered(false)
                // }
                setIsPlayerRegistered(data.is_player); 
                // setIsPlayerRegistered(data.is_player == 'true');
                console.log(isPlayerRegistered)
            } catch (error) {
                console.error("Error checking player status:", error);
            }
        };

        checkPlayerStatus();
        check_auth();
    }, []);

    function handleLoginClick() {
        navigate('/login');
    }

    function handleRegisterClick() {
        navigate('/register');
    }

    function handleClickMatches() {
        navigate('/matches');
    }

    function handleClickTeams() {
        navigate('/teams');
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

    function handleRegisterAsPlayer() {
        setShowPlayerForm(true);
    }

    function handlePlayerFormChange(event) {
        const { name, value } = event.target;
        setPlayerData(prev => ({ ...prev, [name]: value }));
    }

    const handlePlayerFormSubmit = async (event) => {
        event.preventDefault();
        console.log("Player Data:", playerData);

        try {
            const createPlayerResponse = await fetch('https://sportify-production.up.railway.app/api/players/create/', {
                method: "POST",
                body: JSON.stringify(playerData),
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
            });

            if (!createPlayerResponse.ok) {
                throw new Error("Invalid username or password");
            }

            const responseData = await createPlayerResponse.json();
            console.log("Player created successfully:", responseData);

            // Update state after successful registration
            setIsPlayerRegistered(true);
            setShowPlayerForm(false);
            setPlayerData({ first_name: '', last_name: '', login: '' });

        } catch (error) {
            console.error("Error creating player:", error);
            // Handle error state or display error message to the user
        }
    }

    function handlePlayerFormCancel() {
        setShowPlayerForm(false);
        setPlayerData({ first_name: '', last_name: '', login: '' });
    }

    return (
        <>
            <div className="content">
                <div className='firstlayer'></div>
                <video autoPlay muted loop id="myVideo">
                    <source src={videoSource} type="video/mp4" />
                </video>
                <div className="container">
                    <header>
                        <h2 className='logo'>Sportify</h2>
                        <div className='nav'>
                            <ul>
                                <li onClick={handleClickTeams}>Teams</li>
                                <li onClick={handleClickMatches}>Matches</li>
                            </ul>
                        </div>
                        <div className='icons'>
                            <a href='https://www.instagram.com/' target="_blank" rel="noopener noreferrer">
                                <InstaIcon />
                            </a>
                            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                                <LinkIcon />
                            </a>
                        </div>
                    </header>
                    <div className='section'>
                        {isAdmin ? (
                            <>
                                <img alt="" src="https://api.dicebear.com/9.x/avataaars/svg?seed=Aidan" width="100px"/>
                                <h1>Welcome Admin</h1>
                                <button className="button-4" role="button" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <img alt="" src="https://api.dicebear.com/9.x/avataaars/svg?seed=sdsd" width="100px"/>
                                <h1>Welcome</h1>
                                {!
                                isPlayerRegistered && (
                                    <button className="player-reg" role="button" onClick={handleRegisterAsPlayer}>Be a Player</button>
                                )}
                                {isPlayerRegistered && <p>You're a player</p>}
                                <button className="button-4" role="button" onClick={handleLogout}>Logout</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showPlayerForm && (
                <div className="overlay" onClick={handlePlayerFormCancel}></div>
            )}

            <div className={`form-popup ${showPlayerForm ? "show" : 'hide'}`}>
                <div className="form">
                    <div className="title">Register as Player</div>
                    <div className="subtitle">Enter your details</div>
                    <form onSubmit={handlePlayerFormSubmit}>
                        <div className="input-container ic1">
                            <input id="first_name" className="input" type="text" placeholder="First Name" name="first_name" value={playerData.first_name} onChange={handlePlayerFormChange} required />
                        </div>
                        <div className="input-container ic1">
                            <input id="last_name" className="input" type="text" placeholder="Last Name" name="last_name" value={playerData.last_name} onChange={handlePlayerFormChange} required />
                        </div>
                        <div className="input-container ic1">
                            <input id="login" className="input" type="text" placeholder="Login" name="login" value={playerData.login} onChange={handlePlayerFormChange} required />
                        </div>
                        <div className="button-row">
                            <button type="submit" className="submit">Register</button>
                            <button type="button" className="cancel" onClick={handlePlayerFormCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}