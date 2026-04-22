// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// =======================
// STORAGE ENGINES
// =======================

// Memory storage for images and PDFs (small files → Cloudinary via buffer)
const memoryStorage = multer.memoryStorage();

// Disk storage for videos (large files → written to tmp/ then uploaded to Vimeo)
const tmpDir = path.join(__dirname, '..', 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const videoDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// =======================
// FILE FILTERS
// =======================

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

// =======================
// SIZE LIMITS
// =======================
const imageLimits = { fileSize: 5 * 1024 * 1024 };     // 5 MB
const resumePdfLimits = { fileSize: 10 * 1024 * 1024 }; // 10 MB
const videoLimits = { fileSize: 100 * 1024 * 1024 };    // 100 MB (Vimeo handles large files)
const jdFileLimits = { fileSize: 10 * 1024 * 1024 };    // 10 MB

// =======================
// MULTER INSTANCES
// =======================

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

// Video uses diskStorage to avoid memory overload
const uploadResumeVideo = multer({
  storage: videoDiskStorage,
  fileFilter: videoFileFilter,
  limits: videoLimits,
});

// For JD / PDF uploads
const uploadJdFile = multer({
  storage: memoryStorage,
  fileFilter: pdfFileFilter,
  limits: jdFileLimits,
});

// =======================
// VIDEO SIZE VALIDATION MIDDLEWARE
// =======================
// Additional layer: validates file size after multer processes it
const validateVideoSize = (maxSizeMB = 100) => {
  return (req, res, next) => {
    if (req.file && req.file.size > maxSizeMB * 1024 * 1024) {
      // Clean up the temp file
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
      return res.status(400).json({
        message: `Video file too large. Maximum size is ${maxSizeMB}MB.`
      });
    }
    next();
  };
};

module.exports = {
  uploadProfilePhoto,
  uploadResumePdf,
  uploadResumeVideo,
  uploadJdFile,
  validateVideoSize,
};
