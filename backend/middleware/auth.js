const jwt = require('jsonwebtoken');

/**
 * Middleware to require a valid JWT token in the Authorization header.
 * Implementation: Bearer <token>
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach the decoded user payload to the request
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json({ message: 'Session expired or invalid token. Please log in again.' });
    }
  }

  // No token provided
  return res.status(401).json({ message: 'Authentication required. No token provided.' });
};

/**
 * Middleware to check if the authenticated user has a specific role.
 * Can take a single string or an array of strings.
 */
const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const userRole = req.user.role;
  const authorized = Array.isArray(role) ? role.includes(userRole) : userRole === role;

  if (authorized) {
    return next();
  }

  res.status(403).json({ message: `Forbidden: This action requires the [${role}] role.` });
};

module.exports = { requireAuth, requireRole };
