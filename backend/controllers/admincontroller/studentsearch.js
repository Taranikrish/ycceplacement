const Student = require('../../models/student');

// SEARCH STUDENTS WITH FILTER + PAGINATION
const searchStudents = async (req, res) => {
  try {
    const {
      name,
      rollNumber,
      branch,
      domain,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (rollNumber) query.rollNumber = { $regex: rollNumber, $options: 'i' };
    if (branch) query.branch = branch;
    if (domain) query.domain = { $in: [domain] };

    const skip = (page - 1) * limit;

    const students = await Student.find(query)
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalStudents: total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { searchStudents };
