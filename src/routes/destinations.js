const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} = require('../controllers/destinationController');

const router = express.Router();

const destinationValidation = [
  body('name').notEmpty().trim(),
  body('description').notEmpty(),
  body('country').notEmpty().trim(),
  body('city').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('duration').isInt({ min: 1 })
];

// Public
router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);

// Admin seulement
router.post('/', auth, requireRole('ADMIN'), destinationValidation, createDestination);
router.put('/:id', auth, requireRole('ADMIN'), destinationValidation, updateDestination);
router.delete('/:id', auth, requireRole('ADMIN'), deleteDestination);

module.exports = router;