const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Assurer que l'email est unique dans la base de données
  },
  mot_de_passe: {
    type: String,
    required: true,
  },
  type_utilisateur: {
    type: String,
    enum: ['fan', 'club', 'admin'],
    required: true,
  },
}, { timestamps: true }); // Ajouter des timestamps pour `createdAt` et `updatedAt`

// Créer le modèle User à partir du schéma
const User = mongoose.model('User', userSchema);

module.exports = User;
