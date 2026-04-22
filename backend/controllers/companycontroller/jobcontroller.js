const Job = require('../../models/job');
const Application = require('../../models/application');
const Company = require('../../models/company');
const fs = require('fs');
const path = require('path');

const uploadJD = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // The JD PDF is stored in public/uploads/jds by multer diskStorage
    const pdfUrl = `/uploads/jds/${req.file.filename}`;

    const updatedJob = await Job.findById(req.params.jobId);

    if (!updatedJob) {
      if (fs.existsSync(req.file.path)) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Local file delete error:', err);
        });
      }
      return res.status(404).json({ message: 'Job not found' });
    }

    // Delete the old JD from disk if it exists
    if (updatedJob.jd_public_id) {
      const oldPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'jds', updatedJob.jd_public_id);
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, (err) => {
          if (err) console.error('Failed to delete old JD file:', err);
        });
      }
    }

    updatedJob.jd_file = pdfUrl;
    updatedJob.jd_public_id = req.file.filename;
    await updatedJob.save();

    res.json({
      message: 'JD uploaded successfully',
      jd_file: pdfUrl,
      jd_public_id: req.file.filename
    });
  } catch (err) {
    console.error('uploadJD error:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (e) => {});
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const createJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, deadline, branch } = req.body;
    // branch can now be an array or string; ensure it's an array
    const branchArray = Array.isArray(branch) ? branch : (branch ? [branch] : []);
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
      branch: branchArray,
    };

    if (req.file) {
      try {
        const pdfUrl = `/uploads/jds/${req.file.filename}`;
        jobData.jd_file = pdfUrl;
        jobData.jd_public_id = req.file.filename;
      } catch (uploadErr) {
        console.error('Failed to link JD while creating job:', uploadErr);
        // Cleanup local file if failed
        if (fs.existsSync(req.file.path)) {
          fs.unlink(req.file.path, (e) => {});
        }
        return res.status(500).json({ message: 'Failed to process JD file' });
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

    const jobs = await Job.find({ companyId })
      .populate('companyId', 'name emailId')
      .populate('visibleToStudents', 'name rollNumber branch');
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
      const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'jds', jobDoc.jd_public_id);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (e) => {
          if (e) console.warn('Failed to remove JD from local storage (continuing):', e);
        });
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
