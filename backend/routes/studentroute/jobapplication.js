const express = require('express');
const router = express.Router();
const { getAvailableJobs, applyForJob, getStudentApplications } = require('../../controllers/studentcontroller/jobapplication');
const { requireAuth, requireRole } = require('../../middleware/auth');

// Get available jobs for registered students
router.get('/jobs', requireAuth, requireRole(['student','admin']), getAvailableJobs);

// Apply for a job
router.post('/jobs/apply', requireAuth, requireRole('student'), applyForJob);

// Get student's applications
router.get('/applications', requireAuth, requireRole('student'), getStudentApplications);

module.exports = router;
