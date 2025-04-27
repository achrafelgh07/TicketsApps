const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès interdit. Token manquant.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    console.error('Erreur token:', err);
    res.status(401).json({ message: 'Token invalide.' });
  }
};
