const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Route pour créer un utilisateur
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', auth, userController.get);

module.exports = router;
