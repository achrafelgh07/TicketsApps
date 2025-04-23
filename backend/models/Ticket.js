// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  id_match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  catégorie: {
    type: String,
    enum: ['VIP', 'normal'],
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  disponibilité: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
