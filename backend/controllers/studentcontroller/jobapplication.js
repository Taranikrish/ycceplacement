const Job = require('../../models/job');
const Application = require('../../models/application');
const Student = require('../../models/student');
const Admin = require('../../models/admin');

const getAvailableJobs = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    const admin = await Admin.findById(req.user._id);

    // Admin can see all jobs
    if (admin) {
      const jobs = await Job.find({})
        .populate('companyId', 'name emailId location contactPerson')
        .sort({ createdDate: -1 });
      return res.json(jobs);
    }

    // Student checks
    if (!student || !student.isregistered) {
      return res.status(403).json({ message: 'Student must be registered to view jobs' });
    }

    // Students can only see approved jobs where they are in the visibility list or it's visible to all
    const jobs = await Job.find({
      isApproved: true,
      $or: [
        { isVisibleToAll: true },
        { visibleToStudents: student._id }
      ]
    })
      .populate('companyId', 'name emailId location contactPerson')
      .sort({ createdDate: -1 });

    res.json(jobs);
  } catch (err) {
    console.error('getAvailableJobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Rest of the functions remain the same
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const studentId = req.user._id;

    const student = await Student.findById(studentId);
    if (!student || !student.isregistered) {
      return res.status(403).json({ message: 'Student must be registered to apply for jobs' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if student has access to this job
    if (!job.isApproved || 
        (!job.isVisibleToAll && !job.visibleToStudents.includes(studentId))) {
      return res.status(403).json({ message: 'You do not have access to this job' });
    }

    const existingApplication = await Application.findOne({ jobId, studentId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    const application = new Application({
      jobId,
      companyId: job.companyId,
      studentId
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error('applyForJob error:', err);
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
    console.error('getStudentApplications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAvailableJobs, applyForJob, getStudentApplications };