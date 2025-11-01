const express = require('express');
const router = express.Router();
const { verifyCompany } = require('../../controllers/admincontroller/adminveriupd');
// GET /api/companies/search?q=abc&status=verified
router.patch('/:id/verify', verifyCompany);

module.exports = router;