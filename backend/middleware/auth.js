const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

const requireRole = (role) => (req, res, next) => {
  if (Array.isArray(role)) {
    if (req.user && role.includes(req.user.role)) {
      return next();
    }
  } else {
    if (req.user && req.user.role === role) {
      return next();
    }
  }
  res.status(403).json({ message: 'Forbidden' });
};

module.exports = { requireAuth, requireRole };
