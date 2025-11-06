const { validationResult } = require('express-validator');
const Destination = require('../models/Destination');

const getAllDestinations = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    
    const { country, city, minPrice, maxPrice, available, search } = req.query;
    
    // Filtres
    const filter = {};
    if (country) filter.country = new RegExp(country, 'i');
    if (city) filter.city = new RegExp(city, 'i');
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { country: new RegExp(search, 'i') }
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }
    if (available !== undefined) filter.available = available === 'true';

    const [destinations, total] = await Promise.all([
      Destination.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Destination.countDocuments(filter)
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: destinations
    });
  } catch (error) {
    console.error('Erreur destinations:', error);
    res.status(500).json({ error: 'Erreur récupération destinations' });
  }
};

const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination non trouvée' });
    }
    res.json(destination);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID invalide' });
    }
    console.error('Erreur destination:', error);
    res.status(500).json({ error: 'Erreur récupération destination' });
  }
};

const createDestination = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const destination = new Destination(req.body);
    await destination.save();

    res.status(201).json(destination);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Destination existe déjà' });
    }
    console.error('Erreur création destination:', error);
    res.status(500).json({ error: 'Erreur création destination' });
  }
};

const updateDestination = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({ error: 'Destination non trouvée' });
    }

    res.json(destination);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID invalide' });
    }
    console.error('Erreur mise à jour destination:', error);
    res.status(500).json({ error: 'Erreur mise à jour destination' });
  }
};

const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination non trouvée' });
    }
    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID invalide' });
    }
    console.error('Erreur suppression destination:', error);
    res.status(500).json({ error: 'Erreur suppression destination' });
  }
};

module.exports = {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
};