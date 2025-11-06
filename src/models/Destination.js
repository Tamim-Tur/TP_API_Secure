const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  available: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String,
    trim: true
  }],
  maxTravelers: {
    type: Number,
    default: 10,
    min: 1,
    max: 50
  }
}, {
  timestamps: true
});

destinationSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);