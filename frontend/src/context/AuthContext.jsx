import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate token and fetch user details on load (cookie-based)
  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      // Clean up local reference, no need to touch localStorage as cookies are http-only
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Send OTP
  const sendOTP = async (email) => {
    try {
      const res = await api.post('/auth/send-otp', { email });
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to send OTP';
    }
  };

  // Register user
  const register = async (name, email, password, otp) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, otp });
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
      });
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Registration failed';
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
      });
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Login failed';
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sendOTP,
        register,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
