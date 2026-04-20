const Company = require('../../models/company');

// Search Companies (with optional verified filter)
const searchCompany = async (req, res) => {
  try {
    const query = req.query.q || ''; // e.g. ?q=abc
    const status = req.query.status; // e.g. ?status=verified or ?status=unverified

    // Base search condition (case-insensitive search by name or email)
    let filter = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { emailId: { $regex: query, $options: 'i' } }
      ]
    };

    // Add verified status filter if provided
    if (status) {
      if (status === 'verified') filter.isVerified = true;
      else if (status === 'unverified') filter.isVerified = false;
    }
    console.log('Query:', req.query);

    const companies = await Company.find(filter)
      .select('name emailId phoneNumber location contactPerson isVerified createdAt')
      .limit(10);

    res.json(companies);
  } catch (err) {
    console.error('Company Search Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { searchCompany };