// utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail", // Service prédéfini (pas besoin de host/port)
  auth: {
    user: 'imadait157@gmail.com', // Votre adresse Gmail
    pass: 'suuv rzhe xafr fczy', // 🔒 Évitez de hardcoder : utilisez des variables d'environnement
  },
});

  const sendEmail = async (options) => {
    if (!options?.to) {
      throw new Error('Aucun destinataire spécifié');
    }
  
    const mailOptions = {
      from: 'service@bloom.ma',
      to: options.to, // Accès correct via l'objet
      subject: options.subject,
      html: options.html || options.text // Gérer HTML/text
    };

  try {
    await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé à :", options.to);
    return true;
  } catch (error) {
    console.error("Erreur détaillée:", {
      code: error.code,
      response: error.response,
      stack: error.stack
    });
    throw new Error('Échec d\'envoi de l\'email');
  }
};

module.exports = sendEmail;