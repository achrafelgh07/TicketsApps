// controllers/reservationController.js
const Reservation = require('../models/Reservation');

// Fonction pour créer une réservation


const Ticket = require('../models/Ticket');

exports.createReservation = async (req, res) => {
  try {
    const { userId, ticketId, statut } = req.body;

    // 1. Trouver le ticket correspondant
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé.' });
    }

    // 2. Vérifier la disponibilité
    if (ticket.disponibilité <= 0) {
      return res.status(400).json({ message: 'Ce ticket n\'est plus disponible.' });
    }

    // 3. Créer la réservation
    const reservation = await Reservation.create({
      id_utilisateur: userId || null,
      id_ticket: ticketId,
      statut: statut || 'réservé',
    });

    // 4. Mettre à jour la disponibilité
    ticket.disponibilité -= 1;
    await ticket.save();

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Erreur de réservation :', error);
    res.status(500).json({ message: 'Erreur lors de la réservation' });
  }
};




// Fonction pour récupérer toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error: error.message });
  }
};

// Fonction pour récupérer une réservation par ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la réservation', error: error.message });
  }
};
