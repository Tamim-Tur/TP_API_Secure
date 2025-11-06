function errorHandler(err, req, res, next) {
  console.error('Erreur:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
    return res.status(422).json({ error: 'Erreur de validation', details: errors });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'Doublon détecté' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'ID invalide' });
  }

  res.status(500).json({ error: 'Erreur interne du serveur' });
}

module.exports = errorHandler;