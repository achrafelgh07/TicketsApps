
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
export const getMatch = async () => {
  try {
    const response = await api.get('/matches/with-tickets'); // <- mise à jour ici
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};


const réserverTicket = async (userId, ticketId) => {
  try {
    const res = await api.post('/reservations', {
      userId,
      ticketId,
      statut: 'réservé'
    });
    console.log('Réservation réussie :', res.data);
    return res.data;
  } catch (error) {
    console.error('Erreur lors de la réservation :', error.response?.data || error.message);
    throw error;
  }
};


export const deleteReservation = async (reservationId) => {
  try {
    await api.delete(`/reservations/${reservationId}`);
    return true; // renvoyer juste true pour dire que c'est réussi
  } catch (error) {
    console.error('Erreur suppression:', error);
    throw error;
  }
};

export const payReservation = async (reservationId) => {
  try {
    const response = await api.put(`/reservations/${reservationId}`, { statut: 'payé' });
    return response.data; // on renvoie les données mises à jour
  } catch (error) {
    console.error('Erreur paiement:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users/get');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
};

export const registerUser = async (userData) => {
  const res = await api.post('/users/register', userData);
  return res.data;
};



export const updateUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};






  
  
  
  export default api;