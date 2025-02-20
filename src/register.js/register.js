import React, { useState } from 'react';
import './register.css';
import videoSource from '../assets/background-video.mp4';
import { useNavigate } from 'react-router-dom';

function RegisterPage({ setStatus }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const Handleregister = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    // Validate inputs
    if (!login || !password || !passwordC) {
      setError("All fields are required!");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    if (password !== passwordC) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true); // Set loading state

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/register', {
        method: "POST",
        body: JSON.stringify({
          login: login,
          password: password,
          re_password: passwordC,
        }),
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed. Please try again.");
      }

      // Registration successful
      navigate('/login'); // Redirect to login page
    } catch (error) {
      setError(error.message || "An error occurred during registration.");
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

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

            {error && <div className="register-error">{error}</div>}

            <label htmlFor="username" className="register-label">Login</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              id="username"
              placeholder="Enter your username"
              className="register-input"
              required
            />

            <label htmlFor="password" className="register-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="Enter your password"
              className="register-input"
              required
            />
            
            <label htmlFor="passwordC" className="register-label">Confirm Your Password</label>
            <input
              type="password"
              value={passwordC}
              onChange={(e) => setPasswordC(e.target.value)}
              id="passwordC"
              placeholder="Confirm Your Password"
              className="register-input"
              required
            />
            
            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;