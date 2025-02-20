import { useState, useEffect } from "react";
import LoginPage from "./login/login";
import RegisterPage from "./register.js/register";
import Matches from "./matches/matches";
import TeamsPage from "./teams/teams";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./landingpage/landPage";

function App() {
  const [isAdmin, setAdmin] = useState(() => {
    const isAdminLocalVariable = localStorage.getItem("isAdmin");
    return isAdminLocalVariable === "true";
  });


  function setStatus(status) {
    localStorage.setItem("isAdmin", status); 
    setAdmin(status); 
  }


  function handleLogout() {
    localStorage.removeItem("isAdmin"); 
    setAdmin(false);
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage isAdmin={isAdmin}  onLogout={handleLogout}/>} />
        <Route path="/login" element={<LoginPage setStatus={setStatus} isAdmin={isAdmin} />} />
        <Route path="/register" element={<RegisterPage setStatus={setStatus} isAdmin={isAdmin} />} />
        <Route path="/matches" element={<Matches setStatus={setStatus} isAdmin={isAdmin} onLogout={handleLogout}/>} />
        <Route
          path="/teams"
          element={<TeamsPage setStatus={setStatus} isAdmin={isAdmin} onLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}

export default App;