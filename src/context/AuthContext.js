// src/context/AuthContext.js
import React, { createContext, useState } from 'react';
import { mockApi } from '../services/mockApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await mockApi.login(email, password);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};