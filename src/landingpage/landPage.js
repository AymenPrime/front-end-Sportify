import { useNavigate } from "react-router";
import { useState } from 'react';
import './land.css';

import videoSource from '../assets/background-video.mp4';
import InstaIcon from '../components/InstaIcon';
import LinkIcon from '../components/LinkIcon';

function LandingPage({ isAdmin, isUser, onLogout }) {
    const navigate = useNavigate();
    const [showPlayerForm, setShowPlayerForm] = useState(false);
    const [playerData, setPlayerData] = useState({
        first_name: '',
        last_name: '',
        login: ''
    });
    const [isPlayerRegistered, setIsPlayerRegistered] = useState(false); // New state to track player registration

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
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        onLogout();
        navigate('/');
    }

    function handleRegisterAsPlayer() {
        setShowPlayerForm(true);
    }

    function handlePlayerFormChange(event) {
        const { name, value } = event.target;
        setPlayerData(prev => ({ ...prev, [name]: value }));
    }

    function handlePlayerFormSubmit(event) {
        event.preventDefault();
        // Handle form submission (e.g., send data to an API)
        console.log("Player Data:", playerData);
        setIsPlayerRegistered(true); // Set player registration to true
        setShowPlayerForm(false);
        setPlayerData({ first_name: '', last_name: '', login: '' });
    }

    function handlePlayerFormCancel() {
        setShowPlayerForm(false);
        setPlayerData({ first_name: '', lastName: '', login: '' });
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
                                <li onClick={handleClickTables}>Tables</li>
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
                                {/* {!isPlayerRegistered && (
                                    <button className="player" role="button" onClick={handleRegisterAsPlayer}>Be a Player</button>
                                )}
                                {isPlayerRegistered && <p>You're a player</p>} */}
                                <button className="button-4" role="button" onClick={handleLogout}>Logout</button>
                            </>
                        ) : isUser ? (
                            <>
                                <img alt="" src="https://api.dicebear.com/9.x/avataaars/svg?seed=sdsd" width="100px"/>
                                <h1>Welcome</h1>
                                {!isPlayerRegistered && (
                                    <button className="player-reg" role="button" onClick={handleRegisterAsPlayer}>Be a Player</button>
                                )}
                                {isPlayerRegistered && <p>You're a player</p>}
                                <button className="button-4" role="button" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <h1>LeetSportify</h1>
                                <p>At this Club, we celebrate teamwork, passion, and the love of the game. Whether you're a player, a fan, or part of our community, join us as we strive for excellence on and off the pitch. Explore our matches, meet our players, and be part of the action!</p>
                                <div className="button-container">
                                    <button onClick={handleLoginClick}>
                                        <span className="span-mother">
                                            <span>L</span>
                                            <span>o</span>
                                            <span>g</span>
                                            <span>i</span>
                                            <span>n</span>
                                        </span>
                                        <span className="span-mother2">
                                            <span>L</span>
                                            <span>o</span>
                                            <span>g</span>
                                            <span>i</span>
                                            <span>n</span>
                                        </span>
                                    </button>
                                    <button onClick={handleRegisterClick}>
                                        <span className="span-mother">
                                            <span>R</span>
                                            <span>e</span>
                                            <span>g</span>
                                            <span>i</span>
                                            <span>s</span>
                                            <span>t</span>
                                            <span>e</span>
                                            <span>r</span>
                                        </span>
                                        <span className="span-mother2">
                                            <span>R</span>
                                            <span>e</span>
                                            <span>g</span>
                                            <span>i</span>
                                            <span>s</span>
                                            <span>t</span>
                                            <span>e</span>
                                            <span>r</span>
                                        </span>
                                    </button>
                                </div>
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
                            <input id="lastName" className="input" type="text" placeholder="Last Name" name="lastName" value={playerData.last_name} onChange={handlePlayerFormChange} required />
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

export default LandingPage;