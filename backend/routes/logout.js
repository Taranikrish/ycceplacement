// routes/logout.js
const express = require('express');
const router = express.Router();

// Logout route
router.get('/', (req, res) => {
  // If using Passport sessions, log out
  if (req.logout) {
    req.logout(err => {
      if (err) console.error('Logout error:', err);
    });
  }

  // Destroy session if exists
  if (req.session) {
    req.session.destroy(err => {
      if (err) console.error('Session destruction error:', err);
    });
  }

  // Clear cookie just in case
  res.clearCookie('connect.sid');

  // For JWT-based auth, frontend should also remove token
  // You can send a response to indicate successful logout
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Please remove JWT on client side.'
  });
});

module.exports = router;
