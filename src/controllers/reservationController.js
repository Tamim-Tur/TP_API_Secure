const { validationResult } = require('express-validator');
const Reservation = require('../models/Reservation');
const Destination = require('../models/Destination');

const getAllReservations = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [reservations, total] = await Promise.all([
      Reservation.find()
        .populate('user', 'email firstName lastName')
        .populate('destination')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Reservation.countDocuments()
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: reservations
    });
  } catch (error) {
    console.error('Erreur réservations:', error);
    res.status(500).json({ error: 'Erreur récupération réservations' });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [reservations, total] = await Promise.all([
      Reservation.find({ user: req.user.id })
        .populate('destination')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Reservation.countDocuments({ user: req.user.id })
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: reservations
    });
  } catch (error) {
    console.error('Erreur réservations:', error);
    res.status(500).json({ error: 'Erreur récupération réservations' });
  }
};

const createReservation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { destinationId, startDate, endDate, travelers, specialRequests } = req.body;

    // Vérifier destination
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ error: 'Destination non trouvée' });
    }
    if (!destination.available) {
      return res.status(400).json({ error: 'Destination non disponible' });
    }

    // Vérifier dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ error: 'Dates invalides' });
    }

    // Calcul prix
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = destination.price * travelers * days;

    const reservation = new Reservation({
      user: req.user.id,
      destination: destinationId,
      startDate: start,
      endDate: end,
      travelers,
      totalPrice,
      specialRequests
    });

    await reservation.save();
    await reservation.populate('destination');

    res.status(201).json(reservation);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID invalide' });
    }
    console.error('Erreur création réservation:', error);
    res.status(500).json({ error: 'Erreur création réservation' });
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'email');

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    // Vérifier permissions
    if (req.user.role !== 'ADMIN' && reservation.user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    reservation.status = status;
    await reservation.save();
    await reservation.populate('destination');

    res.json(reservation);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID invalide' });
    }
    console.error('Erreur mise à jour réservation:', error);
    res.status(500).json({ error: 'Erreur mise à jour réservation' });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID invalide' });
    }
    console.error('Erreur suppression réservation:', error);
    res.status(500).json({ error: 'Erreur suppression réservation' });
  }
};

module.exports = {
  getAllReservations,
  getUserReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation
};