const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  // 1. Check for JWT Token in Header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  // 2. Check for Passport Session (if cookies are sent)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized' });
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
