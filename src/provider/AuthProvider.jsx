import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const userData = await authAPI.getMe();
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem("token", response.token);
      setUser(response.user);
      await loadUser();
      toast.success("Registration successful!");
      return response;
    } catch (error) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem("token", response.token);
      setUser(response.user);
      await loadUser();
      toast.success("Login successful!");
      return response;
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;