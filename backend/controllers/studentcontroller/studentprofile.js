const Student = require('../../models/student');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log('Cloudinary config:', {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
  secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = 'image', transformation = [], format = null) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      type: 'upload',           // ensure asset is created as normal uploaded resource
      transformation,
    };

    if (format) {
      uploadOptions.format = format;
    }

    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(error);
      } else {
        console.log('Cloudinary upload success:', result && result.public_id);
        resolve(result);
      }
    }).end(buffer);
  });
};

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
      resumeVideoPublicId: student.resumeVideoPublicId || null
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
      resumeVideoPublicId: student.resumeVideoPublicId || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const { branch, sgpa, domain, mobileNumber, address, city, state, pin } = req.body;

    // Calculate CGPA as average of 6 sgpa values
    let cgpa = 0;
    if (sgpa && Array.isArray(sgpa) && sgpa.length === 6) {
      cgpa = sgpa.reduce((sum, val) => sum + val, 0) / 6;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.user._id,
      {
        branch,
        sgpa,
        cgpa,
        mobileNumber,
        domain,
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
        // media fields
        profilePhoto: updatedStudent.profilePhoto || null,
        profilePhotoPublicId: updatedStudent.profilePhotoPublicId || null,
        resumePdf: updatedStudent.resumePdf || null,
        resumePdfPublicId: updatedStudent.resumePdfPublicId || null,
        resumeVideo: updatedStudent.resumeVideo || null,
        resumeVideoPublicId: updatedStudent.resumeVideoPublicId || null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload profile photo
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      'student_profiles',
      'image',
      [{ width: 300, height: 300, crop: 'fill' }]
    );

    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: result.secure_url, profilePhotoPublicId: result.public_id },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Profile photo uploaded successfully',
      profilePhoto: result.secure_url,
      profilePhotoPublicId: result.public_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload resume PDF
const uploadResumePdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      'student_resumes',
      'image',
      [],
      'pdf' // Set format to pdf during upload for proper Content-Type
    );

    // Use the secure_url which will now have the correct format
    const pdfUrl = result.secure_url;

    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { resumePdf: pdfUrl, resumePdfPublicId: result.public_id },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Resume PDF uploaded successfully',
      resumePdf: pdfUrl,
      resumePdfPublicId: result.public_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload resume video
const uploadResumeVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      'student_videos',
      'video'
    );

    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { resumeVideo: result.secure_url, resumeVideoPublicId: result.public_id },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Resume video uploaded successfully',
      resumeVideo: result.secure_url,
      resumeVideoPublicId: result.public_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete profile photo
const deleteProfilePhoto = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.profilePhotoPublicId) {
      await cloudinary.uploader.destroy(student.profilePhotoPublicId, { resource_type: 'image', type: 'upload' });
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

// Delete resume PDF
const deleteResumePdf = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.resumePdfPublicId) {
      await cloudinary.uploader.destroy(student.resumePdfPublicId, { resource_type: 'image', type: 'upload' });
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

// Delete resume video
const deleteResumeVideo = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.resumeVideoPublicId) {
      await cloudinary.uploader.destroy(student.resumeVideoPublicId, { resource_type: 'video', type: 'upload' });
      student.resumeVideo = null;
      student.resumeVideoPublicId = null;
      await student.save();
    }

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
