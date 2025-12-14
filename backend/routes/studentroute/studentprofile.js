const express = require('express');
const router = express.Router();
const {
  getStudentProfile,
  getStudentProfileById,
  updateStudentProfile,
  uploadProfilePhoto,
  uploadResumePdf,
  uploadResumeVideo,
  deleteProfilePhoto,
  deleteResumePdf,
  deleteResumeVideo
} = require('../../controllers/studentcontroller/studentprofile');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { uploadProfilePhoto: uploadProfilePhotoMiddleware, uploadResumePdf: uploadResumePdfMiddleware, uploadResumeVideo: uploadResumeVideoMiddleware } = require('../../middleware/upload');

// Get student profile
router.get('/profile', requireAuth, requireRole('student'), getStudentProfile);

// Get student profile by ID (for admin and company)
router.get('/profile/:studentId', requireAuth, requireRole(['admin', 'company']), getStudentProfileById);

// Update student profile
router.put('/profile', requireAuth, requireRole('student'), updateStudentProfile);

// Upload profile photo
router.post('/profile/photo', requireAuth, requireRole('student'), uploadProfilePhotoMiddleware.single('profilePhoto'), uploadProfilePhoto);

// Upload resume PDF
router.post('/profile/resume-pdf', requireAuth, requireRole('student'), uploadResumePdfMiddleware.single('resumePdf'), uploadResumePdf);

// Upload resume video
router.post('/profile/resume-video', requireAuth, requireRole('student'), uploadResumeVideoMiddleware.single('resumeVideo'), uploadResumeVideo);

// Delete profile photo
router.delete('/profile/photo', requireAuth, requireRole('student'), deleteProfilePhoto);

// Delete resume PDF
router.delete('/profile/resume-pdf', requireAuth, requireRole('student'), deleteResumePdf);

// Delete resume video
router.delete('/profile/resume-video', requireAuth, requireRole('student'), deleteResumeVideo);

module.exports = router;
