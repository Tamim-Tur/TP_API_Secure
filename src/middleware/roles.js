const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  if (req.user.role !== role && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  next();
};

module.exports = { requireRole };