const express = require('express');
const router = express.Router();
const { searchCompany } = require('../controllers/admincontroller/companysearch');

// GET /api/companies/search?q=abc&status=verified
router.get('/search', searchCompany);

module.exports = router;
