const Job = require('../../models/job');
const Application = require('../../models/application');
const Company = require('../../models/company');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

const uploadJD = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      'jd_uploads',
      'image',
      [],
      'pdf' // Set format to pdf during upload for proper Content-Type
    );

    // Use the secure_url which will now have the correct format
    const pdfUrl = result.secure_url;

    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.jobId },
      {
        $set: {
          jd_file: pdfUrl,
          jd_public_id: result.public_id,
        },
      },
      { new: true }
    );

    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });

    res.json({
      message: 'JD uploaded successfully',
      jd_file: pdfUrl,
      jd_public_id: result.public_id
    });
  } catch (err) {
    console.error('uploadJD error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, deadline, branch } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Missing job title or description' });

    const companyId = req.user && req.user._id;
    if (!companyId) return res.status(401).json({ message: 'Unauthorized' });

    const company = await Company.findById(companyId);
    if (!company || !company.isVerified) return res.status(403).json({ message: 'Company must be verified by admin to create jobs' });

    const jobData = {
      companyId,
      title,
      description,
      requirements,
      salary,
      location,
      deadline,
      branch,
    };

    if (req.file && req.file.buffer) {
      try {
        const result = await uploadToCloudinary(
          req.file.buffer,
          `jd_uploads/${companyId}`,
          'image',
          [],
          'pdf'
        );

        jobData.jd_file = result.secure_url;
        jobData.jd_public_id = result.public_id;
      } catch (uploadErr) {
        console.error('Failed to upload JD while creating job:', uploadErr);
        return res.status(500).json({ message: 'Failed to upload JD file' });
      }
    }

    const newJob = new Job(jobData);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    console.error('createJob error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.user && req.user._id;
    if (!companyId) return res.status(401).json({ message: 'Unauthorized' });

    const jobs = await Job.find({ companyId }).populate('companyId', 'name emailId');
    res.json(jobs);
  } catch (err) {
    console.error('getCompanyJobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCompanyApplications = async (req, res) => {
  try {
    const companyId = req.user && req.user._id;
    if (!companyId) return res.status(401).json({ message: 'Unauthorized' });

    const applications = await Application.find({ companyId })
      .populate('jobId', 'title description')
      .populate('studentId', 'name emailId rollNumber cgpa branch');

    res.json(applications);
  } catch (err) {
    console.error('getCompanyApplications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const companyId = req.user && req.user._id;
    if (!companyId) return res.status(401).json({ message: 'Unauthorized' });

    const jobDoc = await Job.findOne({ _id: jobId, companyId });
    if (!jobDoc) return res.status(404).json({ message: 'Job not found or you do not have permission to delete this job' });

    if (jobDoc.jd_public_id) {
      try {
        await cloudinary.uploader.destroy(jobDoc.jd_public_id, { resource_type: 'image' });
      } catch (cloudErr) {
        try {
          await cloudinary.uploader.destroy(jobDoc.jd_public_id);
        } catch (e) {
          console.warn('Failed to remove JD from Cloudinary (continuing):', e);
        }
      }
    }

    await Application.deleteMany({ jobId });
    await Job.findByIdAndDelete(jobId);

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('deleteJob error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createJob,
  getCompanyJobs,
  getCompanyApplications,
  deleteJob,
  uploadJD,
};
