import React, { useState } from 'react';
import { useEffect } from 'react';
import './matches.css';
import { useNavigate } from 'react-router-dom';

function Match({ team1, team2, date, time, onDelete }) {
  return (
    <div className="match">
      <button className="delete-match-button" onClick={onDelete}>
        ×
      </button>
      <div className="teams">
        <img alt='' src={`https://api.dicebear.com/9.x/bottts/avif?seed=${team1}`} height="100px" />
        <h3>{team1}</h3>
        <div className="vs-container">
          <p className="date-time">{date}</p>
          <h2>vs</h2>
          <p className="date-time">{time}</p>
        </div>
        <h3>{team2}</h3>
        <img alt='' src={`https://api.dicebear.com/9.x/bottts/avif?seed=${team2}`} width="100px" />
      </div>
    </div>
  );
}

const MatchesList = ({ matches, onDeleteMatch }) => {
  if (matches.length === 0) {
    return (
      <div className="no-matches">
        <h1>No matches available.</h1>
      </div>
    );
  }

  return (
    <div className="matches-list">
      {matches.map((match, index) => (
        <Match
          key={index}
          team1={match.team1}
          team2={match.team2}
          date={match.date}
          time={match.time}
          onDelete={() => onDeleteMatch(index)} // Pass the delete function
        />
      ))}
    </div>
  );
};

const Matches = ({ isAdmin, onLogout }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newMatch, setNewMatch] = useState({
    team1: '',
    team2: '',
    date: '',
    time: '',
  });
  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    onLogout();
    navigate('/login');
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMatch({
      ...newMatch,
      [name]: value,
    });
  };

  const handleAddMatch = (e) => {
    e.preventDefault();
    if (newMatch.team1 && newMatch.team2 && newMatch.date && newMatch.time) {
      setMatches([...matches, newMatch]);
      setNewMatch({ team1: '', team2: '', date: '', time: '' });
      setIsFormVisible(false);
    } else {
      alert('Please fill in all fields!');
    }
  };

  const handleDeleteMatch = (index) => {
    const updatedMatches = matches.filter((_, i) => i !== index);
    setMatches(updatedMatches);
  };

  return (
    <div className='content-matches'>
      <div className="App">
        <header className='header'>
          <h2 className='logo'>Sportify</h2>
          <div className='nav'>
            <ul>
              <li onClick={() => navigate('/teams')}>Teams</li>
              <li onClick={() => navigate('/matches')}>Matches</li>
            </ul>
          </div>
          {isAdmin && (
            <button className="button-4" role="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </header>
        <div>
          <div className='matches-header'>
            <h1>Upcoming Matches</h1>
            {isAdmin && (
              <button
                className="add-match-button"
                onClick={() => setIsFormVisible(!isFormVisible)}
              >
                +
              </button>
            )}
          </div>
          {isFormVisible && (
            <div className="form-match-overlay">
              <form onSubmit={handleAddMatch} className="add-match-form">
                <h2>Add a New Match</h2>
                <div className="form-group">
                  <label>Team 1:</label>
                  <input
                    type="text"
                    name="team1"
                    value={newMatch.team1}
                    onChange={handleInputChange}
                    placeholder="Enter Team 1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Team 2:</label>
                  <input
                    type="text"
                    name="team2"
                    value={newMatch.team2}
                    onChange={handleInputChange}
                    placeholder="Enter Team 2"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={newMatch.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time:</label>
                  <input
                    type="time"
                    name="time"
                    value={newMatch.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="add-match-button">
                    Add Match
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsFormVisible(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        <MatchesList matches={matches} onDeleteMatch={handleDeleteMatch} />
      </div>
    </div>
  );
};

export default Matches;