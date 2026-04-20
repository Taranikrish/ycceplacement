const Company = require('../../models/company');

function normalizeLinkedInUrl(url) {
  if (!url) return url;
  url = url.trim();
  // If user pasted only the path like "linkedin.com/in/username" or "www.linkedin.com/..." add protocol
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

function isValidUrl(url) {
  try {
    // Basic check using URL constructor
    // Also ensure it's a LinkedIn domain (optional)
    const parsed = new URL(url);
    // Optional: only allow linkedin domain (uncomment to enforce)
    // if (!/(^|\.)linkedin\.com$/i.test(parsed.hostname)) return false;
    return true;
  } catch (e) {
    return false;
  }
}

const getCompanyProfile = async (req, res) => {
  try {
    const companyId = req.params.companyId || req.user._id;
    const company = await Company.findById(companyId);
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
      linkedInUrl: company.linkedInUrl,
      dpiitNumber: company.dpiitNumber
    });
  } catch (err) {
    console.error('getCompanyProfile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCompanyProfile = async (req, res) => {
  try {
    const { phoneNumber, location, contactPerson, linkedInUrl, dpiitNumber } = req.body;

    let normalizedLinkedInUrl = linkedInUrl ? normalizeLinkedInUrl(linkedInUrl) : undefined;
    if (normalizedLinkedInUrl && !isValidUrl(normalizedLinkedInUrl)) {
      return res.status(400).json({ message: 'Invalid LinkedIn URL' });
    }

    // Build update object only with provided fields
    const updateFields = {};
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;
    if (location !== undefined) updateFields.location = location;
    if (contactPerson !== undefined) updateFields.contactPerson = contactPerson;
    if (normalizedLinkedInUrl !== undefined) updateFields.linkedInUrl = normalizedLinkedInUrl;
    if (dpiitNumber !== undefined) updateFields.dpiitNumber = dpiitNumber;
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
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
        linkedInUrl: updatedCompany.linkedInUrl,
        dpiitNumber: updatedCompany.dpiitNumber,
        verified: updatedCompany.isVerified,
      }
    });
  } catch (err) {
    console.error('updateCompanyProfile error:', err);
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
    console.error('deleteCompanyAccount error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCompanyProfile, updateCompanyProfile, deleteCompanyAccount };
