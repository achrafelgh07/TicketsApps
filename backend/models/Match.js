const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  équipe_1: { type: String, required: true },
  équipe_2: { type: String, required: true },
  date: { type: Date, required: true },
  heure: { type: String, required: true }, // ou `type: Date` pour stocker l'heure complète
  lieu: { type: String, required: true }
  
});

// Mongoose ajoute automatiquement un `_id` (pas besoin de le déclarer)
module.exports = mongoose.model('Match', matchSchema);