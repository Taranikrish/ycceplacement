const express = require('express');
const router = express.Router();

/**
 * Logout Route
 * In a stateless JWT architecture, the server doesn't "log out" a user.
 * The client simply discards the token. This route exists to provide a 
 * consistent endpoint and clear any lingering cookies.
 */
router.get('/', (req, res) => {
  // Clear the session cookie just in case it was set by a previous version
  res.clearCookie('portal.sid');
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Token should be cleared on the client side.'
  });
});

module.exports = router;
