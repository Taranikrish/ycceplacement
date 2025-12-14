const Job = require('../../models/job');
const Application = require('../../models/application');
const Student = require('../../models/student');
const Admin=require('../../models/admin')
const getAvailableJobs = async (req, res) => {
  try {
    // Only registered students can view jobs
    const student = await Student.findById(req.user._id);
    const admin = await Admin.findById(req.user._id);

    if (!(admin || (student && student.isregistered))) {
      return res.status(403).json({ message: 'Student must be registered to view jobs' });
    }

    const jobs = await Job.find({})
      .populate('companyId', 'name emailId location contactPerson')
      .sort({ createdDate: -1 });

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const studentId = req.user._id;

    // Check if student is registered
    const student = await Student.findById(studentId);
    if (!student || !student.isregistered) {
      return res.status(403).json({ message: 'Student must be registered to apply for jobs' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, studentId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    // Create application
    const application = new Application({
      jobId,
      companyId: job.companyId,
      studentId
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user._id;

    const applications = await Application.find({ studentId })
      .populate('jobId', 'title description salary deadline')
      .populate('companyId', 'name emailId location')
      .sort({ appliedDate: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAvailableJobs, applyForJob, getStudentApplications };
