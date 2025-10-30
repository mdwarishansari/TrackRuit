import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      // Mock user data for demo - replace with actual API call
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      };
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock login - replace with actual API call
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: email
      };
      const mockToken = 'mock-jwt-token';
      
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      
      return { success: true, user: mockUser, token: mockToken };
    } catch (error) {
      throw new Error('Login failed. Please try again.');
    }
  };

  const register = async (userData) => {
    try {
      // Mock registration - replace with actual API call
      const mockUser = {
        id: '1',
        name: userData.name,
        email: userData.email
      };
      const mockToken = 'mock-jwt-token';
      
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      
      return { success: true, user: mockUser, token: mockToken };
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (userData) => {
    // Mock update profile
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const changePassword = async (passwordData) => {
    // Mock change password
    return { success: true };
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};