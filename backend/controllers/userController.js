const User = require('../models/User');

// Créer un nouvel utilisateur
const createUser = async (req, res) => {
  try {
    const { nom, email, mot_de_passe, type_utilisateur } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Crée un nouvel utilisateur
    const newUser = new User({
      nom,
      email,
      mot_de_passe, // Assurez-vous de hasher le mot de passe avant de le stocker
      type_utilisateur,
    });

    // Enregistrer l'utilisateur dans la base de données
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
  }
};

module.exports = { createUser };
