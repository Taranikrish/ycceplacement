const express = require('express');
const router = express.Router();
const logout = require('../controllers/logoutcontroller')
// GET /api/companies/search?q=abc&status=verified
router.get('/', logout);

module.exports = router;
