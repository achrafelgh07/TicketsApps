const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');

// Route pour créer un utilisateur
router.post('/', createUser);

module.exports = router;
