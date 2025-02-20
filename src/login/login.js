import React, { useState } from 'react';
import './login.css';
import videoSource from '../assets/background-video.mp4';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setStatus }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const HandleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Step 1: Authenticate and get tokens
      const tokenResponse = await fetch('https://sportify-production.up.railway.app/api/auth/token', {
        method: "POST",
        body: JSON.stringify({
          login: username,
          password: password,
        }),
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!tokenResponse.ok) {
        throw new Error("Invalid username or password");
      }

      const tokenData = await tokenResponse.json();
      localStorage.setItem("accessToken", tokenData.access);
      localStorage.setItem("refreshToken", tokenData.refresh);

      // Step 2: Fetch user details
      const userResponse = await fetch('https://sportify-production.up.railway.app/api/users/me', {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${tokenData.access}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userData = await userResponse.json();
      const isAdmin = userData.user.is_admin === true;

      // Step 3: Update admin status and navigate
      setStatus(isAdmin);
      navigate('/');
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Navigate to the registration page
  };

  return (
    <>
      <div className='content-login'>
        <div className='firstlayer-one'></div>
        <video autoPlay muted loop id="myVideo-login">
          <source src={videoSource} type="video/mp4" />
        </video>
        <div className='login-page'>
          <button onClick={handleRegisterClick} className="register-btn">
            Register
          </button>
          <div className="login-container">
            <form className="login-form">
              <h1 className="login-title">Login</h1>

              {error && <div className="login-error">{error}</div>}

              <label htmlFor="username" className="login-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                placeholder="Enter your username"
                className="login-input"
                required
              />

              <label htmlFor="password" className="login-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="Enter your password"
                className="login-input"
                required
              />  
              <div className='log-btn'>
                <button type="submit" onClick={HandleLogin} className="login-button">
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;