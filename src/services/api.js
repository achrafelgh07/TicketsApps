
  import axios from 'axios';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  const api = axios.create({
    baseURL: 'http://10.0.2.2:5000/api',
  });
  
  // Corrigez l'intercepteur en le rendant async
  api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  export const getMatches = async () => {
    try {
      const response = await api.get('/matches');
      return response.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
    
  };

  
  export const getMatchById = async (id) => {
  try {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur getMatchById:', error);
    throw error;
  }
};

export const createReservation = async (reservationData) => {
  try {
    const response = await api.post('/reservations', reservationData);  // Utilisation de `api` pour envoyer la requête POST
    return response.data; // Renvoie les données de la réservation
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    throw new Error('Erreur lors de la création de la réservation');
  }
};

export const addMatchApi = async (matchData) => {
  try {
    // Création du match
    const matchResponse = await api.post('/matches', {
      équipe_1: matchData.team1,
      équipe_2: matchData.team2,
      date: matchData.date,
      heure: new Date(matchData.date).toTimeString().split(' ')[0], // HH:MM:SS
      lieu: matchData.stadium,
    });

    const matchId = matchResponse.data._id;
    console.log("✅ Match créé avec ID:", matchId);

    // Création du ticket VIP
    await api.post('/tickets', {
      id_match: matchId,
      catégorie: 'VIP',
      prix: Number(matchData.vipPrice),
      disponibilité: Number(matchData.vipTicketQuantity),
    });

    // Création du ticket Normal
    await api.post('/tickets', {
      id_match: matchId,
      catégorie: 'normal',
      prix: Number(matchData.regularPrice),
      disponibilité: Number(matchData.ticketQuantity),
    });

    return matchResponse.data;
  } catch (error) {
    console.error('❌ Erreur addMatchApi:', error.response?.data || error.message);
    throw error;
  }
};





  
  
  
  export default api;