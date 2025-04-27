const Match = require('../models/Match');
const Ticket = require('../models/Ticket');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

exports.createMatch = async (req, res) => {
  try {
    const newMatch = await Match.create(req.body);
    res.status(201).json(newMatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Récupérer tous les matches
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Récupérer un match par ID + ses tickets
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).lean(); // lean pour objet JS
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }

    const tickets = await Ticket.find({ id_match: match._id }).lean();

    // Injecte les tickets dans l'objet du match
    match.tickets = tickets;

    res.status(200).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.getMatchesByTicketCategory = async (req, res) => {
  const { catégorie } = req.params;
  try {
    // Trouver les tickets avec la catégorie demandée
    const tickets = await Ticket.find({ catégorie }).populate('id_match');
    // Extraire les matchs uniques
    const matchMap = new Map();
    tickets.forEach(ticket => {
      if (ticket.id_match) matchMap.set(ticket.id_match._id.toString(), ticket.id_match);
    });

    const uniqueMatches = Array.from(matchMap.values());
    res.json(uniqueMatches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMatchesWithTickets = async (req, res) => {
  try {
    const matches = await Match.find();

    const matchesWithTickets = await Promise.all(
      matches.map(async (match) => {
        const tickets = await Ticket.find({ id_match: match._id });

        const ticketsWithReservations = await Promise.all(
          tickets.map(async (ticket) => {
            const reservations = await Reservation.find({ id_ticket: ticket._id });
            return {
              ...ticket.toObject(),
              reservations, // tu peux filtrer ou résumer si tu veux
            };
          })
        );

        return {
          ...match.toObject(),
          tickets: ticketsWithReservations,
        };
      })
    );

    res.json(matchesWithTickets);
  } catch (error) {
    console.error('Erreur lors du chargement des matchs avec tickets:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

