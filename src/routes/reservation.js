const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const {
  getAllReservations,
  getUserReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation
} = require('../controllers/reservationController');

const router = express.Router();

const reservationValidation = [
  body('destinationId').notEmpty(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('travelers').isInt({ min: 1, max: 50 })
];

const statusValidation = [
  body('status').isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
];

router.get('/', auth, requireRole('ADMIN'), getAllReservations);
router.get('/my-reservations', auth, getUserReservations);
router.post('/', auth, reservationValidation, createReservation);
router.patch('/:id/status', auth, statusValidation, updateReservationStatus);
router.delete('/:id', auth, requireRole('ADMIN'), deleteReservation);

module.exports = router;