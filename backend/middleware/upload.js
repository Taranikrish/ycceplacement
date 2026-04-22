// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// =======================
// STORAGE ENGINES
// =======================

// Directories
const tmpDir = path.join(__dirname, '..', 'tmp');
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
const profileDir = path.join(uploadsDir, 'profiles');
const resumeDir = path.join(uploadsDir, 'resumes');
const jdDir = path.join(uploadsDir, 'jds');

[tmpDir, profileDir, resumeDir, jdDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Dynamic Disk Storage
const customDiskStorage = (destinationDir) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationDir);
  },
  filename: (req, file, cb) => {
    let ext = file.mimetype.split('/')[1];
    // Simple mapping to handle cases like 'jpeg' -> 'jpg' if needed, but mimetype split is usually fine.
    if (ext === 'octet-stream') ext = 'bin';

    const userId = req.user && req.user._id ? req.user._id.toString() : 'guest';
    const safeFilename = `${userId}_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}.${ext}`;
    
    cb(null, safeFilename);
  },
});

const profileStorage = customDiskStorage(profileDir);
const resumeStorage = customDiskStorage(resumeDir);
const jdStorage = customDiskStorage(jdDir);
const videoDiskStorage = customDiskStorage(tmpDir);

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
  storage: profileStorage,
  fileFilter: imageFileFilter,
  limits: imageLimits,
});

const uploadResumePdf = multer({
  storage: resumeStorage,
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
  storage: jdStorage,
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
      // Clean up the temp file asynchronously
      if (fs.existsSync(req.file.path)) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Temp video delete error:', err);
        });
      }
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
