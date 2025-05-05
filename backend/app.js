const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const matchRoutes = require('./routes/matchRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes'); // Ajout des routes pour les utilisateurs
require('dotenv').config(); // Charger les variables d'environnement depuis .env


const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Pour analyser les requêtes JSON

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Timeout de sélection de serveur
  socketTimeoutMS: 45000, // Timeout de socket
  maxPoolSize: 10, // Taille maximale du pool de connexions
  retryWrites: true, // Réessayer les écritures en cas d'échec
  w: 'majority', // Garantir que l'écriture soit confirmée par la majorité des répliques
})
  .then(() => console.log('🎉 Connecté à MongoDB avec succès !'))
  .catch(err => {
    console.error('💥 Erreur MongoDB:', err.message);
    process.exit(1); // Arrêt propre en cas d'erreur
  });

// Routes
app.use('/api/matches', matchRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes); // Ajout de la route des utilisateurs
app.use('/api',require('./routes/stripe'));
module.exports = app;
