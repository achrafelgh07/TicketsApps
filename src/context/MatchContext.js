import React, { createContext, useState, useEffect } from 'react';
import { addMatchApi, getMatch } from '../services/api';

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    try {
      const data = await getMatch(); // API retourne les matchs avec tickets
      setMatches(data);
    } catch (error) {
      console.error('Erreur fetchMatches:', error);
    }
  };

  const addMatch = async (matchData) => {
    const match = await addMatchApi(matchData);
    await fetchMatches(); // <-- Rafraîchit la liste des matchs après ajout
    return match;
  };

  useEffect(() => {
    fetchMatches(); // Récupère au démarrage
  }, []);

  return (
    <MatchContext.Provider value={{ matches, addMatch, fetchMatches }}>
      {children}
    </MatchContext.Provider>
  );
};
