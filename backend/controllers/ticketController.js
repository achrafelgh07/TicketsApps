// controllers/ticketController.js
const Ticket = require('../models/Ticket');

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('id_match');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('id_match');
    if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTicketByMatchId = async (req, res) => {
  try {
    const tickets = await Ticket.find({ id_match: req.params.matchId });
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: 'Aucun ticket pour ce match' });
    }
    res.json(tickets); // Renvoie toutes les catégories
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createTicket = async (req, res) => {
  const { id_match, catégorie, prix, disponibilité } = req.body;

  try {
    const newTicket = new Ticket({ id_match, catégorie, prix, disponibilité });
    const saved = await newTicket.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Erreur création ticket:", err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.getAllTicketsWithMatch = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('id_match');
    res.json(tickets);
  } catch (error) {
    console.error('Erreur lors de la récupération des tickets :', error);
    res.status(500).json({ message: "Erreur serveur lors du chargement des tickets." });
  }
};


exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const result = await Ticket.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Ticket non trouvé' });
    res.json({ message: 'Ticket supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
