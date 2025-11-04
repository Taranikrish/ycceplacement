const Admin = require('../../models/admin');

const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({
      name: admin.name,
      email: admin.emailId,
      role: admin.role,
      department: 'Placement Cell',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAdminProfile };
