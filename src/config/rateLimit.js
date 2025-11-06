const rateLimit = require('express-rate-limit');

const global = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes' }
});

const login = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives de connexion' }
});

module.exports = { global, login };