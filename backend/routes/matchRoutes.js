const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Routes pour les matches
router.get('/', matchController.getAllMatches);
router.get('/with-tickets', matchController.getMatchesWithTickets);
router.get('/:id', matchController.getMatchById);
router.post('/',matchController.createMatch);
router.get('/with-tickets/:catégorie', matchController.getMatchesByTicketCategory);


module.exports = router;