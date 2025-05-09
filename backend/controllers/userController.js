const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Charger le fichier .env
require('dotenv').config();

// Inscription
exports.register = async (req, res) => {
  try {
    const { nom, email, mot_de_passe, type_utilisateur } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      nom,
      email,
      mot_de_passe: hashedPassword,
      type_utilisateur // fan, club, admin
    });

    await newUser.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: newUser
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Chercher l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { id: user._id, type_utilisateur: user.type_utilisateur },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        type_utilisateur: user.type_utilisateur
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.get = (req, res) => {
  res.json(req.user);
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ type_utilisateur: 'fan' }).select('-mot_de_passe');
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};




// PUT - Modifier un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour' });
  }
};

// DELETE - Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression' });
  }
};
