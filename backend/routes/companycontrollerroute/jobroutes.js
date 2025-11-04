const express = require('express');
const router = express.Router();
const { createJob, getCompanyJobs, getCompanyApplications, deleteJob } = require('../../controllers/companycontroller/jobcontroller');
const { requireAuth, requireRole } = require('../../middleware/auth');

router.post('/jobs', requireAuth, requireRole('company'), createJob);
router.get('/jobs', requireAuth, requireRole('company'), getCompanyJobs);
router.get('/applications', requireAuth, requireRole('company'), getCompanyApplications);
router.delete('/jobs/:jobId', requireAuth, requireRole('company'), deleteJob);

module.exports = router;
