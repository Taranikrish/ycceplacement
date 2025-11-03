const express = require('express');
const router = express.Router();
const { verifyCompany, deleteCompany } = require('../../controllers/admincontroller/adminverified');
const { requireAuth, requireRole } = require('../../middleware/auth');

// GET /api/companies/search?q=abc&status=verified
router.patch('/:id/verify', requireAuth, requireRole('admin'), verifyCompany);
router.delete('/:id', requireAuth, requireRole('admin'), deleteCompany);

module.exports = router;
