require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// Configuration MongoDB avec gestion d'erreur améliorée
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // 5 secondes de timeout
})
.then(() => console.log('✅ Connecté à MongoDB avec succès'))
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB:', err.message);
  process.exit(1); // Quitte l'application si la connexion échoue
});

// Gestion des erreurs non catchées
process.on('unhandledRejection', err => {
  console.error('⚠️ Erreur non gérée:', err);
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
});

// Gestion propre de la fermeture
process.on('SIGTERM', () => {
  console.log('🛑 Fermeture du serveur...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('📦 Connexions fermées');
      process.exit(0);
    });
  });
});