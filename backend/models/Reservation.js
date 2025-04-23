const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  id_utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  id_ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  statut: {
    type: String,
    enum: ['réservé', 'payé'],
    default: 'réservé'
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
