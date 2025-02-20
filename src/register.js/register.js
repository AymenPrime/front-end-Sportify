import React, { useState } from 'react';
import './register.css';
import videoSource from '../assets/background-video.mp4';
import { useNavigate } from 'react-router-dom';

function RegisterPage({ setStatus }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  
  const navigate = useNavigate();

  function Handleregister(e) {
    e.preventDefault();
    
    if (!login || !password || !passwordC) {
      alert("All fields are required!");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    if (password !== passwordC) {
      alert("Passwords do not match!");
      return;
    }
    
    fetch('http://127.0.0.1:8000/api/token', {
      method: "POST",
      body: JSON.stringify({
        login: login,
        password: password,
        passwordC: passwordC,
      }),
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json",
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.access) {  
          navigate('/');
          setStatus(true);
          sessionStorage.setItem("accessToken", data.access);  
          sessionStorage.setItem("refreshToken", data.refresh);  
          sessionStorage.setItem("username", login);  // Store the username
          console.log("Tokens and username stored in sessionStorage!");
        }
      })
      .catch(error => {
        console.error("Error during registration:", error);
      });
  }

  return (
    <div className='content-register'>
      <div className='firstlayer-one'></div>
      <video autoPlay muted loop id="myVideo-register">
        <source src={videoSource} type="video/mp4" />
      </video>
      <div className='register-page'>
        <div className="register-container">
          <form className="rgi-form" onSubmit={Handleregister}>
            <h1 className="register-title">Register</h1>
            
            <label htmlFor="username" className="register-label">Login</label>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} id="username" placeholder="Enter your username" className="register-input" required />

            <label htmlFor="password" className="register-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Enter your password" className="register-input" required />
            
            <label htmlFor="passwordC" className="register-label">Confirm Your Password</label>
            <input type="password" value={passwordC} onChange={(e) => setPasswordC(e.target.value)} id="passwordC" placeholder="Confirm Your Password" className="register-input" required />
            
            <button type="submit" className="register-button">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
