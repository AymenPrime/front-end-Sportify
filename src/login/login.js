import React from 'react';
import { useState } from 'react'
import './login.css';
import videoSource from '../assets/background-video.mp4'
import { useNavigate } from 'react-router-dom';

function LoginPage({ setStatus }) {
  const [login, getUsername] = useState("");
  const [password, getPassword] = useState("");
  
  const navigate = useNavigate();
  function HandleLogin(e) {
    e.preventDefault();
    
    fetch('http://127.0.0.1:8000/api/token', {
      method: "POST",
      body: JSON.stringify({
        login: login,
        password: password,
      }),
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json",
      }
    })
      .then(response => {
        if (response.status === 200) {
          setStatus(true);
          sessionStorage.setItem("username", login);  // Store the username
          navigate('/');
        } else {
          alert("Incorrect login or password!");
        }
        return response.json();
      })
      .catch(error => {
        console.error("Error during login:", error);
      });
  }

  return (
    <>
      <div className='content-login'>
        <div className='firstlayer-one'></div>
        <video autoPlay muted loop id="myVideo-login">
          <source src={videoSource} type="video/mp4" />
        </video>
        <div className='login-page'>
          <div className="login-container">
            <form className="login-form">
              <h1 className="login-title">Login</h1>

              <label htmlFor="username" className="login-label">Username</label>
              <input type="text" value={login} onChange={(e) => getUsername(e.target.value)} id="username" placeholder="Enter your username" className="login-input" required />

              <label htmlFor="password" className="login-label">Password</label>
              <input type="password" value={password} onChange={(e) => getPassword(e.target.value)} id="password" placeholder="Enter your password" className="login-input" required />

              <button type="submit" onClick={HandleLogin} className="login-button">Log In</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
