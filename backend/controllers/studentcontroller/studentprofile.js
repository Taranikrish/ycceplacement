const Student = require('../../models/student');
const fs = require('fs');
const path = require('path');
const { Vimeo } = require('@vimeo/vimeo');

// =======================
// VIMEO CLIENT INIT
// =======================
const vimeoClient = new Vimeo(
  process.env.VIMEO_CLIENT_ID,
  process.env.VIMEO_CLIENT_SECRET,
  process.env.VIMEO_ACCESS_TOKEN
);
// console.log('Vimeo config:', {
//   clientId: process.env.VIMEO_CLIENT_ID ? 'SET' : 'MISSING',
//   clientSecret: process.env.VIMEO_CLIENT_SECRET ? 'SET' : 'MISSING',
//   accessToken: process.env.VIMEO_ACCESS_TOKEN ? 'SET' : 'MISSING'
// });

// =======================
// VIMEO HELPERS
// =======================

/**
 * Safely deletes a temp file. Silently ignores errors (file may already be gone).
 */
const cleanupTempFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('[Vimeo] Temp file cleaned up:', filePath);
    }
  } catch (err) {
    console.error('[Vimeo] Failed to clean up temp file:', err.message);
  }
};

/**
 * Uploads a file to Vimeo with retry support.
 * Returns a Promise that resolves with the Vimeo URI (e.g. /videos/123456789).
 */
const uploadToVimeo = (filePath, metadata, maxRetries = 2) => {
  return new Promise((resolve, reject) => {
    let attempt = 0;

    const tryUpload = () => {
      attempt++;
      console.log(`[Vimeo] Upload attempt ${attempt}/${maxRetries + 1}...`);

      vimeoClient.upload(
        filePath,
        metadata,
        // Success callback
        (uri) => {
          console.log(`[Vimeo] Upload successful! URI: ${uri}`);
          resolve(uri);
        },
        // Progress callback
        (bytesUploaded, bytesTotal) => {
          const pct = ((bytesUploaded / bytesTotal) * 100).toFixed(1);
          console.log(`[Vimeo] Upload progress: ${pct}% (${bytesUploaded}/${bytesTotal})`);
        },
        // Error callback
        (error) => {
          console.error(`[Vimeo] Upload error (attempt ${attempt}):`, error);
          if (attempt <= maxRetries) {
            console.log(`[Vimeo] Retrying upload...`);
            setTimeout(tryUpload, 2000 * attempt); // exponential-ish backoff
          } else {
            reject(new Error(`Vimeo upload failed after ${attempt} attempts: ${error}`));
          }
        }
      );
    };

    tryUpload();
  });
};

/**
 * Fetches the correct embed URL using Vimeo oEmbed API.
 * For unlisted videos, we first fetch the privacy hash to construct a valid oEmbed query.
 * Includes a robust retry mechanism to handle Vimeo propagation/processing delays.
 */
const getVimeoVideoLink = async (videoId, retries = 5) => {
  let attempt = 0;
  
  // Initial wait - Vimeo needs time to register the new video in its metadata & oEmbed systems
  console.log(`[Vimeo] Waiting 8s for initial processing of video: ${videoId}...`);
  await new Promise(r => setTimeout(r, 8000));

  while (attempt < retries) {
    try {
      attempt++;
      console.log(`[Vimeo] oEmbed Retrieval - Attempt ${attempt}/${retries}...`);

      // 1. Get the privacy hash from Vimeo Metadata API
      // We use the SDK as it's more reliable than oEmbed for brand new videos
      const videoData = await new Promise((resolve, reject) => {
        vimeoClient.request({
          method: 'GET',
          path: `/videos/${videoId}?fields=privacy,link`
        }, (error, body) => {
          if (error) {
            console.error(`[Vimeo] Metadata API fail (Attempt ${attempt}):`, error.message || error);
            reject(error);
          } else {
            resolve(body);
          }
        });
      });

      const privacyHash = videoData.privacy?.h || null;
      console.log(`[Vimeo] Found privacy hash: ${privacyHash || 'None'}`);
      
      // 2. Construct official oEmbed lookup URL
      // Unlisted videos MUST include the hash in the URL for oEmbed to work
      const oEmbedUrl = privacyHash 
        ? `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}/${privacyHash}`
        : `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`;

      console.log(`[Vimeo] Requesting official oEmbed data: ${oEmbedUrl}`);

      const response = await fetch(oEmbedUrl);
      if (!response.ok) {
        throw new Error(`oEmbed API returned ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !data.html) {
        throw new Error('Embed HTML missing in oEmbed response');
      }

      // 3. Extract src attribute (the clean player URL)
      const match = data.html.match(/src="([^"]+)"/);
      const embedUrl = match ? match[1] : null;

      if (!embedUrl) {
        throw new Error('Failed to parse src from oEmbed HTML');
      }

      console.log('[Vimeo] Success! Extracted embed URL:', embedUrl);
      return embedUrl;

    } catch (error) {
      console.warn(`[Vimeo] getVimeoVideoLink attempt ${attempt} failed: ${error.message}`);
      
      if (attempt < retries) {
        const waitTime = 3000 * attempt;
        console.log(`[Vimeo] Retrying in ${waitTime/1000}s...`);
        await new Promise(r => setTimeout(r, waitTime));
      } else {
        throw new Error(`Exhausted all ${retries} oEmbed fetch attempts. Last error: ${error.message}`);
      }
    }
  }
};

// =======================
// CONTROLLERS
// =======================

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Extract roll number from email (part before @)
    const rollNumber = student.emailId.split('@')[0];

    res.json({
      name: student.name,
      email: student.emailId,
      rollNumber: rollNumber,
      branch: student.branch || '',
      cgpa: student.cgpa || 0,
      mobileNumber: student.mobileNumber || '',
      sgpa: student.sgpa || [],
      domain: student.domain || [],
      isregistered: student.isregistered,
      // media fields
      profilePhoto: student.profilePhoto || null,
      profilePhotoPublicId: student.profilePhotoPublicId || null,
      resumePdf: student.resumePdf || null,
      resumePdfPublicId: student.resumePdfPublicId || null,
      resumeVideo: student.resumeVideo || null,
      resumeVideoPublicId: student.resumeVideoPublicId || null,
      address: student.address || null,
      city: student.city || null,
      state: student.state || null,
      pin: student.pin || null,
      yearOfStudy: student.yearOfStudy || null,
      currentSemester: student.currentSemester || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentProfileById = async (req, res) => {
  try {
    // Allow admin and company to access this
    if (req.user.role !== 'admin' && req.user.role !== 'company') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Extract roll number from email (part before @)
    const rollNumber = student.emailId.split('@')[0];

    res.json({
      name: student.name,
      email: student.emailId,
      rollNumber: rollNumber,
      branch: student.branch || '',
      cgpa: student.cgpa || 0,
      mobileNumber: student.mobileNumber || '',
      sgpa: student.sgpa || [],
      domain: student.domain || [],
      isregistered: student.isregistered,
      // media fields
      profilePhoto: student.profilePhoto || null,
      profilePhotoPublicId: student.profilePhotoPublicId || null,
      resumePdf: student.resumePdf || null,
      resumePdfPublicId: student.resumePdfPublicId || null,
      resumeVideo: student.resumeVideo || null,
      resumeVideoPublicId: student.resumeVideoPublicId || null,
      address: student.address || null,
      city: student.city || null,
      state: student.state || null,
      pin: student.pin || null,
      yearOfStudy: student.yearOfStudy || null,
      currentSemester: student.currentSemester || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const { branch, sgpa, domain, mobileNumber, address, city, state, pin, yearOfStudy, currentSemester } = req.body;

    // Calculate CGPA as average of non-zero sgpa values
    let cgpa = 0;
    if (sgpa && Array.isArray(sgpa)) {
      const validSgpa = sgpa.map(s => parseFloat(s)).filter(s => s > 0);
      if (validSgpa.length > 0) {
        cgpa = validSgpa.reduce((sum, val) => sum + val, 0) / validSgpa.length;
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.user._id,
      {
        branch,
        sgpa,
        cgpa,
        mobileNumber,
        domain,
        address,
        city,
        state,
        pin,
        yearOfStudy,
        currentSemester,
        isregistered: true
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      student: {
        name: updatedStudent.name,
        email: updatedStudent.emailId,
        rollNumber: updatedStudent.emailId.split('@')[0],
        branch: updatedStudent.branch,
        cgpa: updatedStudent.cgpa,
        mobileNumber: updatedStudent.mobileNumber,
        sgpa: updatedStudent.sgpa,
        domain: updatedStudent.domain,
        isregistered: updatedStudent.isregistered,
        // address fields
        address: updatedStudent.address || '',
        city: updatedStudent.city || '',
        state: updatedStudent.state || '',
        pin: updatedStudent.pin || '',
        yearOfStudy: updatedStudent.yearOfStudy || null,
        currentSemester: updatedStudent.currentSemester || null,
        // media fields
        profilePhoto: updatedStudent.profilePhoto || null,
        profilePhotoPublicId: updatedStudent.profilePhotoPublicId || null,
        resumePdf: updatedStudent.resumePdf || null,
        resumePdfPublicId: updatedStudent.resumePdfPublicId || null,
        resumeVideo: updatedStudent.resumeVideo || null,
        resumeVideoPublicId: updatedStudent.resumeVideoPublicId || null,
        
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload profile photo (Local Storage)
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photoUrl = `/uploads/profiles/${req.file.filename}`;

    const student = await Student.findById(req.user._id);

    if (!student) {
      if (fs.existsSync(req.file.path)) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Local file delete error:', err);
        });
      }
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete the old profile photo from disk if it exists
    if (student.profilePhotoPublicId) {
      const oldPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'profiles', student.profilePhotoPublicId);
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, (err) => {
          if (err) console.error('Failed to delete old profile photo:', err);
        });
      }
    }

    student.profilePhoto = photoUrl;
    student.profilePhotoPublicId = req.file.filename;
    await student.save();

    res.json({
      message: 'Profile photo uploaded successfully',
      profilePhoto: photoUrl,
      profilePhotoPublicId: req.file.filename
    });
  } catch (err) {
    console.error(err);
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload resume PDF (Local Storage)
const uploadResumePdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const pdfUrl = `/uploads/resumes/${req.file.filename}`;

    const student = await Student.findById(req.user._id);

    if (!student) {
      if (fs.existsSync(req.file.path)) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Local file delete error:', err);
        });
      }
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete the old resume from disk if it exists
    if (student.resumePdfPublicId) {
      const oldPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'resumes', student.resumePdfPublicId);
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, (err) => {
          if (err) console.error('Failed to delete old resume:', err);
        });
      }
    }

    student.resumePdf = pdfUrl;
    student.resumePdfPublicId = req.file.filename;
    await student.save();

    res.json({
      message: 'Resume PDF uploaded successfully',
      resumePdf: pdfUrl,
      resumePdfPublicId: req.file.filename
    });
  } catch (err) {
    console.error(err);
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// Upload resume video (VIMEO)
// =======================
const uploadResumeVideo = async (req, res) => {
  const tempFilePath = req.file ? req.file.path : null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('[Vimeo] Uploading video for student:', req.user._id);

    // 1. Simple upload to Vimeo
    const vimeoUri = await new Promise((resolve, reject) => {
      vimeoClient.upload(
        tempFilePath,
        {
          name: `Student_Video_${req.user._id}`,
          privacy: { view: 'unlisted' }
        },
        (uri) => resolve(uri),
        null, // No progress needed for simple version
        (error) => reject(error)
      );
    });

    const videoId = vimeoUri.split('/').pop();

    // 2. Fetch the official watch link (includes privacy hash for unlisted videos)
    const vimeoLink = await new Promise((resolve, reject) => {
      vimeoClient.request({
        method: 'GET',
        path: `/videos/${videoId}?fields=link`
      }, (error, body) => {
        if (error) reject(error);
        else resolve(body.link);
      });
    });

    console.log('[Vimeo] Official Link retrieved:', vimeoLink);

    // 3. Update DB
    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { resumeVideo: vimeoLink, resumeVideoPublicId: videoId },
      { new: true }
    );

    // 3. Cleanup
    cleanupTempFile(tempFilePath);

    res.json({
      message: 'Video uploaded successfully',
      resumeVideo: vimeoLink,
      resumeVideoPublicId: videoId
    });

  } catch (error) {
    console.error('[Vimeo] Upload fail:', error);
    if (tempFilePath) cleanupTempFile(tempFilePath);
    res.status(500).json({ message: 'Failed to upload video' });
  }
};

// Delete profile photo (Local Storage)
const deleteProfilePhoto = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.profilePhotoPublicId) {
      const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'profiles', student.profilePhotoPublicId);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
           if (err) console.error('File delete error:', err);
        });
      }
      student.profilePhoto = null;
      student.profilePhotoPublicId = null;
      await student.save();
    }

    return res.json({ message: 'Profile photo deleted successfully' });
  } catch (err) {
    console.error('deleteProfilePhoto error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete resume PDF (Local Storage)
const deleteResumePdf = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.resumePdfPublicId) {
      const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'resumes', student.resumePdfPublicId);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
           if (err) console.error('File delete error:', err);
        });
      }
      student.resumePdf = null;
      student.resumePdfPublicId = null;
      await student.save();
    }

    return res.json({ message: 'Resume PDF deleted successfully' });
  } catch (err) {
    console.error('deleteResumePdf error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// Delete resume video (VIMEO)
// =======================
const deleteResumeVideo = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.resumeVideoPublicId) {
      return res.json({ message: 'No video to delete' });
    }

    // Delete from Vimeo
    await new Promise((resolve, reject) => {
      vimeoClient.request(
        {
          method: 'DELETE',
          path: `/videos/${student.resumeVideoPublicId}`,
        },
        (error) => {
          if (error) {
            if (error.status_code === 404) {
              console.log('[Vimeo] Already deleted');
              return resolve();
            }

            console.error('[Vimeo] Delete error:', error);
            return reject(error);
          }

          console.log('[Vimeo] Video deleted:', student.resumeVideoPublicId);
          resolve();
        }
      );
    });

    // Only clear DB AFTER successful delete
    student.resumeVideo = null;
    student.resumeVideoPublicId = null;
    await student.save();

    return res.json({ message: 'Resume video deleted successfully' });

  } catch (err) {
    console.error('deleteResumeVideo error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStudentProfile,
  getStudentProfileById,
  updateStudentProfile,
  uploadProfilePhoto,
  uploadResumePdf,
  uploadResumeVideo,
  deleteProfilePhoto,
  deleteResumePdf,
  deleteResumeVideo
};
