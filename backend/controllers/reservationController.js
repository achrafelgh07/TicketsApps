// controllers/reservationController.js
const Reservation = require('../models/Reservation');

// Fonction pour créer une réservation

const sendEmail = require('../utils/sendEmail');


const Ticket = require('../models/Ticket');

const User = require('../models/User');

exports.createReservation = async (req, res) => {
  try {
    const { userId, ticketId, statut } = req.body;

    // Récupère le ticket avec le match associé
    const ticket = await Ticket.findById(ticketId).populate({
      path: 'id_match',
      model: 'Match' // Assurez-vous que c'est le bon nom de modèle
    });

    if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé.' });

    if (ticket.disponibilité <= 0) {
      return res.status(400).json({ message: 'Ce ticket n\'est plus disponible.' });
    }

    const reservation = await Reservation.create({
      id_utilisateur: userId || null,
      id_ticket: ticketId,
      statut: statut || 'réservé',
    });

    ticket.disponibilité -= 1;
    await ticket.save();

    const user = await User.findById(userId).select('nom email');
    
    if (user && user.email && ticket.id_match) {
      const match = ticket.id_match;

      // Vérification des données du match
      console.log('Match data:', {
        équipe_1: match.équipe_1,
        équipe_2: match.équipe_2,
        date: match.date,
        lieu: match.lieu
      });

      await sendEmail({
  to: user.email,
  subject: `Confirmation de réservation - ${match.équipe_1} vs ${match.équipe_2}`,
  html: `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; border-bottom: 2px solid #f5f5f5; padding-bottom: 15px;">
        <img src="[LOGO_URL]" alt="Logo Bloom" style="max-width: 200px; margin-bottom: 15px;">
        <h1 style="color: #2d3748; margin: 10px 0;">Confirmation de réservation</h1>
      </div>

      <div style="padding: 25px 0;">
        <p style="font-size: 16px; color: #4a5568;">Bonjour ${user.nom},</p>
        <p style="font-size: 16px; color: #4a5568;">Nous vous confirmons votre réservation pour le match :</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h2 style="color: #2d3748; margin: 0 0 15px 0;">${match.équipe_1} vs ${match.équipe_2}</h2>
          <table style="width: 100%;">
            <tr>
              <td style="width: 40%; color: #718096;">Date du match</td>
              <td style="font-weight: 500;">${new Date(match.date).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</td>
            </tr>
            <tr>
              <td style="color: #718096;">Stade</td>
              <td style="font-weight: 500;">${match.lieu}</td>
            </tr>
            <tr>
              <td style="color: #718096;">Référence</td>
              <td style="font-weight: 500;">${reservation._id}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 16px; color: #4a5568;">
          Votre billet électronique vous sera envoyé 48h avant le match.<br>
          Conservez précieusement cette référence de réservation.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="[URL_APPLI]/mes-billets" 
             style="background-color: #4299e1; 
                    color: white; 
                    padding: 12px 25px; 
                    border-radius: 5px; 
                    text-decoration: none;
                    display: inline-block;">
            Voir mes billets
          </a>
        </div>
      </div>

      <div style="border-top: 2px solid #f5f5f5; padding-top: 15px; text-align: center;">
        <p style="font-size: 14px; color: #718096;">
          Cet e-mail a été envoyé automatiquement - Merci de ne pas y répondre<br>
          <span style="font-size: 12px;">Bloom Tickets • ${match.lieu} • support@bloom.ma</span>
        </p>
      </div>
    </div>
  `
});
    } else {
      console.warn('Email non envoyé : utilisateur non trouvé ou email manquant');
    }

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Erreur de réservation :', error);
    res.status(500).json({ message: 'Erreur lors de la réservation' });
  }
};


// Fonction pour récupérer toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate({
        path: 'id_ticket',
        populate: {
          path: 'id_match'
        }
      })
      .populate('id_utilisateur');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fonction pour récupérer une réservation par ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la réservation', error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
      const { id } = req.params;
      const { statut } = req.body;

      // Vérifier si la réservation existe
      const reservation = await Reservation.findById(id);
      if (!reservation) {
          return res.status(404).json({ message: 'Réservation non trouvée' });
      }

      // Mettre à jour la réservation
      const updatedReservation = await Reservation.findByIdAndUpdate(
          id,
          { statut },
          { new: true, runValidators: true }
      );

      // Si le statut est annulé, augmenter la disponibilité du ticket
      if (statut === 'annulé') {
          await Ticket.findByIdAndUpdate(
              reservation.id_ticket,
              { $inc: { disponibilité: 1 } }
          );
      }

      res.status(200).json({
          status: 'success',
          data: {
              reservation: updatedReservation
          }
      });
  } catch (err) {
      res.status(400).json({
          status: 'fail',
          message: err.message
      });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Réservation non trouvée' });

    res.json({ message: 'Réservation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le statut d'une réservation (ex: payé)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    if (!statut) {
      return res.status(400).json({ message: 'Statut requis' });
    }

    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Réservation non trouvée' });

    res.json(updated);
  } catch (error) {
    console.error('Erreur mise à jour:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
