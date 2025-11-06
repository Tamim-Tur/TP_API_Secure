require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('./config/cors');
const rateLimit = require('./config/rateLimit');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandle');
// Routes
const authRoutes = require('./routes/auth');
const destinationRoutes = require('./routes/destinations');
const reservationRoutes = require('./routes/reservation');

const app = express();

connectDB();

app.use(morgan('combined'));
app.use(helmet());
app.use(cors);
app.use(rateLimit.global);
app.use(express.json({ limit: '10mb' }));

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/reservations', reservationRoutes);

app.use('/api/auth/login', rateLimit.login);

app.use(errorHandler);

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` API Voyages démarrée sur http://localhost:${PORT}`);
});