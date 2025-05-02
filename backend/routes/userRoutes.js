const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Route pour créer un utilisateur
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', auth, userController.get);
router.get('/get', userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
