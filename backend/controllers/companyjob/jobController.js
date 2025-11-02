const Job = require('../../models/job');
const Company = require('../../models/company');

const addJob = async (req, res) => {
  try {
    const { emailId, title, description, location, salary, deadline } = req.body;

    if (!emailId || !title) {
      return res.status(400).json({ message: "Email and title are required" });
    }

    // Find company using email
    const company = await Company.findOne({ emailId });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (!company.isVerified) {
      return res.status(403).json({ message: 'Company not verified by admin' });
    }

    // Create job
    const job = await Job.create({
      name: company.name,
      company: company._id,
      emailId: company.emailId,
      title,
      description,
      location,
      salary,
      deadline
    });

    console.log("Job Created:", job);

    res.status(201).json({
      message: 'Job added successfully',
      job
    });

  } catch (err) {
    console.error('Error adding job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addJob };
