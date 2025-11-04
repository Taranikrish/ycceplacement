const Company = require('../../models/company');

const getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.user._id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({
      name: company.name,
      email: company.emailId,
      phoneNumber: company.phoneNumber,
      location: company.location,
      contactPerson: company.contactPerson,
      role: company.role,
      verified: company.isVerified,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCompanyProfile = async (req, res) => {
  try {
    const { phoneNumber, location, contactPerson } = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(
      req.user._id,
      {
        phoneNumber,
        location,
        contactPerson
      },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      company: {
        name: updatedCompany.name,
        email: updatedCompany.emailId,
        phoneNumber: updatedCompany.phoneNumber,
        location: updatedCompany.location,
        contactPerson: updatedCompany.contactPerson,
        role: updatedCompany.role,
        verified: updatedCompany.isVerified,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCompanyAccount = async (req, res) => {
  try {
    const companyId = req.user._id;

    // Delete associated jobs and applications first
    const Job = require('../../models/job');
    const Application = require('../../models/application');

    await Job.deleteMany({ companyId });
    await Application.deleteMany({ companyId });

    // Delete the company
    const deletedCompany = await Company.findByIdAndDelete(companyId);

    if (!deletedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({
      message: 'Company account deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCompanyProfile, updateCompanyProfile, deleteCompanyAccount };
