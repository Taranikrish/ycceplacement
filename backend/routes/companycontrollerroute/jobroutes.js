const express = require('express');
const router = express.Router();

const {
  createJob,
  getCompanyJobs,
  getCompanyApplications,
  deleteJob,
  uploadJD
} = require('../../controllers/companycontroller/jobcontroller');

const { requireAuth, requireRole } = require('../../middleware/auth');
const { uploadJdFile } = require('../../middleware/upload');

router.post(
  '/jobs',
  requireAuth,
  requireRole('company'),
  uploadJdFile.single('jd_file'),
  createJob
);

router.get(
  '/jobs',
  requireAuth,
  requireRole('company'),
  getCompanyJobs
);

router.get(
  '/applications',
  requireAuth,
  requireRole('company'),
  getCompanyApplications
);

router.delete(
  '/jobs/:jobId',
  requireAuth,
  requireRole('company'),
  deleteJob
);

router.post(
  '/jd_file/:jobId',
  requireAuth,
  requireRole('company'),
  uploadJdFile.single('jd_file'),
  uploadJD
);

module.exports = router;
