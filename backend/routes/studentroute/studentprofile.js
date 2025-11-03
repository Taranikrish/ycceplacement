const express = require('express');
const router = express.Router();
const { getStudentProfile, getStudentProfileById, updateStudentProfile } = require('../../controllers/studentcontroller/studentprofile');
const { requireAuth, requireRole } = require('../../middleware/auth');

// Get student profile
router.get('/profile', requireAuth, requireRole('student'), getStudentProfile);

// Get student profile by ID (for admin and company)
router.get('/profile/:studentId', requireAuth, requireRole(['admin', 'company']), getStudentProfileById);

// Update student profile
router.put('/profile', requireAuth, requireRole('student'), updateStudentProfile);

module.exports = router;
