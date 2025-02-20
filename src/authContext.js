import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch user session on first load
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const loginfn = async (login, password) => {
    try {
      await axios.post("http://localhost:8000/api/auth/token", { login, password }, { withCredentials: true });
      setIsAuth(true);
      await checkAuth(); // Update user state
    } catch (error) {
      console.error("Login failed", error);
      setIsAuth(false); // Ensure isAuth is set to false on login failure
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
      setUser(null); // Remove user from state
      setIsAuth(false); // Set isAuth to false
      setIsAdmin(false); // Set isAdmin to false
      navigate("/"); // Navigate to home page after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Check if user is authenticated (by making a protected API request)
  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users/me", { withCredentials: true });
      setUser(response.data.user);
      setIsAdmin(response.data.user.is_admin === true); // Use boolean comparison
      setIsAuth(true); // Set isAuth to true if user is authenticated
    } catch (error) {
      setUser(null);
      setIsAuth(false); // Set isAuth to false if user is not authenticated
      setIsAdmin(false); // Set isAdmin to false if user is not authenticated
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuth, loginfn, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);