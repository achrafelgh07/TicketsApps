//src\context\AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, mot_de_passe) => {
    try {
      const res = await api.post('/users/login', { email, mot_de_passe });
      const token = res.data.token;

      await AsyncStorage.setItem('token', token);
      const userRes = await api.get('/users'); // Route protégée pour récupérer les infos
      setUser(userRes.data);
      await AsyncStorage.setItem('user', JSON.stringify(userRes.data));
      return { success: true, user: userRes.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Erreur de connexion' };
    }
  };

  const register = async (nom, email, mot_de_passe) => {
    try {
      const res = await api.post('users/register', {
        nom,
        email,
        mot_de_passe,
        type_utilisateur: 'fan',
      });

      const token = res.data.token;
      await AsyncStorage.setItem('token', token);

      const userRes = await api.get('/users');
      setUser(userRes.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Erreur inscription' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/users');
          setUser(res.data);
        } catch {
          await AsyncStorage.removeItem('token');
        }
      }
    };
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
