const express = require('express');
const router = express.Router();
const { getAdminProfile } = require('../../controllers/admincontroller/adminprofile');
const { requireAuth, requireRole } = require('../../middleware/auth');

router.get('/profile', requireAuth, requireRole('admin'), getAdminProfile);

module.exports = router;
