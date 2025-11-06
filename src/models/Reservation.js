const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  travelers: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  },
  specialRequests: {
    type: String,
    maxlength: 500,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);