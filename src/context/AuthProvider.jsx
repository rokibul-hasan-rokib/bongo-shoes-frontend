import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { loginUser, logoutUser, getUserProfile, updateUserProfile } from "../services/authService";
import { useNavigate } from "react-router-dom";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
//   const [authLoading, setAuthLoading] = useState(false);
  // ✅ Fetch user profile when token exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        const profile = await getUserProfile(token);
        if (profile) setUser(profile);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  // ✅ Login
  const handleLogin = async (email, password) => {
    const data = await loginUser(email, password);
    if (data?.key) {
      setToken(data.key);
      localStorage.setItem("token", data.key);
      const profile = await getUserProfile(data.key);
      setUser(profile);
    //   setAuthLoading(false);
      return true;
    }
    return false;
  };

  // ✅ Logout
  const handleLogout = async () => {
    
    await logoutUser(token);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    // setAuthLoading(false);
    navigate("/"); 
  };

  // ✅ Update Profile
  const handleProfileUpdate = async (updatedData) => {
    const newProfile = await updateUserProfile(token, updatedData);
    if (newProfile) setUser(newProfile);
  };

  const value = {
    user,
    token,
    loading,
    handleLogin,
    handleLogout,
    handleProfileUpdate,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
