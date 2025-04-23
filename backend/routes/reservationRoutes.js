// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Vérifie que ces fonctions existent dans ton contrôleur
router.post('/', reservationController.createReservation); // Créer une réservation
router.get('/', reservationController.getAllReservations); // Récupérer toutes les réservations
router.get('/:id', reservationController.getReservationById); // Récupérer une réservation par ID

module.exports = router;
