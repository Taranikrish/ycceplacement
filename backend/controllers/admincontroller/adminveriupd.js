const Company = require('../../models/company');

// Admin Verification Logic
const verifyCompany = async (req, res) => {
  try {
    const { id } = req.params; // company ID
    const { status } = req.body; // "verified" or "unverified"

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

module.exports = { verifyCompany };
