const express = require('express');
const router = express.Router();
const { getCompanyProfile, updateCompanyProfile, deleteCompanyAccount } = require('../../controllers/companycontroller/companyprofile');
const { requireAuth, requireRole } = require('../../middleware/auth');

router.get('/profile', requireAuth, requireRole('company'), getCompanyProfile);
router.get('/profile/:companyId', requireAuth, requireRole(['company',"admin"]), getCompanyProfile);

router.put('/profile', requireAuth, requireRole('company'), updateCompanyProfile);
router.delete('/profile', requireAuth, requireRole('company'), deleteCompanyAccount);

module.exports = router;
