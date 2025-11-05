const Job = require('../../models/job');
const Application = require('../../models/application');

const createJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, deadline } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Missing job title or description" });
    }

    const companyId = req.user._id; // Assuming req.user has _id

    // Check if company is verified before allowing job creation
    const Company = require('../../models/company');
    const company = await Company.findById(companyId);

    if (!company || !company.isVerified) {
      return res.status(403).json({ message: "Company must be verified by admin to create jobs" });
    }

    const job = new Job({
      companyId,
      title,
      description,
      requirements,
      salary,
      location,
      deadline,
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.user._id;
    const jobs = await Job.find({ companyId }).populate('companyId', 'name emailId');
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCompanyApplications = async (req, res) => {
  try {
    const companyId = req.user._id;
    const applications = await Application.find({ companyId })
      .populate('jobId', 'title description')
      .populate('studentId', 'name emailId rollNumber cgpa branch');
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const companyId = req.user._id;

    // Find the job and verify ownership
    const job = await Job.findOne({ _id: jobId, companyId });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or you do not have permission to delete this job' });
    }

    // Delete associated applications first
    await Application.deleteMany({ jobId });

    // Delete the job
    await Job.findByIdAndDelete(jobId);

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createJob, getCompanyJobs, getCompanyApplications, deleteJob };
