// middleware/upload.js
const multer = require('multer');

// Use memory storage for multer (files are available as buffer)
// NOTE: memoryStorage keeps files in RAM — be careful with large uploads (PDFs are usually fine;
// videos should use diskStorage or stream directly to cloud storage).
const memoryStorage = multer.memoryStorage();

// Common file filters
const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const videoFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('video/')) {
    return cb(new Error('Only video files are allowed!'), false);
  }
  cb(null, true);
};

const pdfFileFilter = (req, file, cb) => {
  // Check for application/pdf; using startsWith handles cases with params
  if (!file.mimetype.startsWith('application/pdf')) {
    return cb(new Error('Only PDF files are allowed!'), false);
  }
  cb(null, true);
};

// Limits (adjust to suit your needs)
const imageLimits = { fileSize: 5 * 1024 * 1024 }; // 5 MB
const resumePdfLimits = { fileSize: 10 * 1024 * 1024 }; // 10 MB for resume images
const videoLimits = { fileSize: 50 * 1024 * 1024 }; // 50 MB for videos (adjust as needed)
const jdFileLimits = { fileSize: 10 * 1024 * 1024 }; // 10 MB for JD / PDF files

// Multer instances (use these as middleware in routes)
const uploadProfilePhoto = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: imageLimits,
});

const uploadResumePdf = multer({
  storage: memoryStorage,
  fileFilter: pdfFileFilter,
  limits: resumePdfLimits,
});

const uploadResumeVideo = multer({
  storage: memoryStorage,
  fileFilter: videoFileFilter,
  limits: videoLimits,
});

// For JD / PDF uploads
const uploadJdFile = multer({
  storage: memoryStorage,
  fileFilter: pdfFileFilter,
  limits: jdFileLimits,
});

module.exports = {
  uploadProfilePhoto,
  uploadResumePdf,
  uploadResumeVideo,
  uploadJdFile, // exported for routes that accept PDF (JD) files
};
