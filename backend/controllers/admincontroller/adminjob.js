const Job = require('../../models/job');
const Student = require('../../models/student');
const Application = require('../../models/application');

// Get all pending jobs (not approved yet)
const getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isApproved: false })
      .populate('companyId', 'name emailId location contactPerson')
      .sort({ createdDate: -1 });
    
    res.json(jobs);
  } catch (err) {
    console.error('getPendingJobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all approved jobs
const getApprovedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isApproved: true })
      .populate('companyId', 'name emailId location contactPerson')
      .populate('visibleToStudents', 'name emailId rollNumber branch')
      .sort({ createdDate: -1 });
    
    res.json(jobs);
  } catch (err) {
    console.error('getApprovedJobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send job to selected students
const sendJobToStudents = async (req, res) => {
  try {
    const { jobId, studentIds, sendToAll } = req.body;
    
    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    let updateData = {
      isApproved: true,
    };

    if (sendToAll) {
      // Send to all registered students
      updateData.isVisibleToAll = true;
      updateData.visibleToStudents = [];
    } else {
      // Send to specific students
      if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(400).json({ message: 'Please select at least one student' });
      }
      
      updateData.isVisibleToAll = false;
      updateData.visibleToStudents = studentIds;
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updateData },
      { new: true }
    ).populate('companyId', 'name emailId');

    res.json({ 
      message: `Job sent to ${sendToAll ? 'all students' : studentIds.length + ' students'} successfully`,
      job: updatedJob 
    });
  } catch (err) {
    console.error('sendJobToStudents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students for selection
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isregistered: true })
      .select('name emailId rollNumber branch cgpa isSelected selectedCompany')
      .sort({ name: 1 });
    
    res.json(students);
  } catch (err) {
    console.error('getAllStudents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Revoke job from students
const revokeJobFromStudents = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { 
        $set: { 
          isApproved: false,
          isVisibleToAll: false,
          visibleToStudents: []
        }
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job revoked from all students', job: updatedJob });
  } catch (err) {
    console.error('revokeJobFromStudents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all applications for a specific job (ADMIN ONLY)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ jobId })
      .populate('studentId', 'name emailId rollNumber branch cgpa mobileNumber')
      .sort({ appliedDate: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error('getJobApplications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const selectStudent = async (req, res) => {
  try {
    const { applicationId, studentId, companyName } = req.body;
    
    // 1. Update Application Status
    await Application.findByIdAndUpdate(applicationId, { status: 'accepted' });
    
    // 2. Update Student Profile
    await Student.findByIdAndUpdate(studentId, {
      isSelected: true,
      selectedCompany: companyName
    });
    
    res.json({ message: 'Student selected successfully' });
  } catch (err) {
    console.error('selectStudent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPendingJobs,
  getApprovedJobs,
  sendJobToStudents,
  getAllStudents,
  revokeJobFromStudents,
  getJobApplications,
  selectStudent,
};