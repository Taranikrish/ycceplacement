const Company = require('../../models/company');
const Job = require('../../models/job');
const Application = require('../../models/application');

// Admin Verification Logic
const verifyCompany = async (req, res) => {
  try {
    const { id } = req.params; // company ID
    const { status } = req.body; // "verified" or "unverified"

    if (!['verified', 'unverified'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

    if (!id || !status) {
      return res.status(400).json({ message: 'Missing company ID or status' });
    }

    const isVerified = status === 'verified';

    const company = await Company.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // If unverified, delete all jobs and applications for this company
    if (!isVerified) {
      await Job.deleteMany({ companyId: id });
      await Application.deleteMany({ companyId: id });
      console.log(`Deleted all jobs and applications for unverified company: ${company.name}`);
    }

    res.json({
      success: true,
      message: `Company marked as ${status}`,
      company
    });

  } catch (err) {
    console.error('Admin Verify Company Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params; // company ID

    if (!id) {
      return res.status(400).json({ message: 'Missing company ID' });
    }

    // Delete associated jobs and applications first
    await Job.deleteMany({ companyId: id });
    await Application.deleteMany({ companyId: id });

    // Delete the company
    const deletedCompany = await Company.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });

  } catch (err) {
    console.error('Admin Delete Company Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { verifyCompany, deleteCompany };
