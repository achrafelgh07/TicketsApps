import React, { createContext, useEffect, useState } from 'react';
import { addMatchApi, getMatches } from '../services/api';

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    try {
      const data = await getMatches(); // Cette fonction doit déjà retourner les tickets imbriqués
      console.log('Matchs récupérés avec tickets:', data);
      setMatches(data);
    } catch (error) {
      console.error('Erreur lors du chargement des matchs', error);
    }
  };

  const addMatch = async (matchData) => {
    try {
      await addMatchApi(matchData); // matchData contient aussi les tickets
      await fetchMatches(); // Recharge les données après ajout
    } catch (error) {
      console.error('Erreur lors de l’ajout du match', error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <MatchContext.Provider value={{ matches, addMatch }}>
      {children}
    </MatchContext.Provider>
  );
};
