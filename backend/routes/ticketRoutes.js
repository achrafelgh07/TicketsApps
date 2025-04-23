// routes/tickets.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');


router.get('/:id', ticketController.getTicketById);
router.get('/byMatch/:matchId', ticketController.getTicketByMatchId);
router.post('/', ticketController.createTicket);
router.put('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);
router.get('/', ticketController.getAllTicketsWithMatch);


module.exports = router;
