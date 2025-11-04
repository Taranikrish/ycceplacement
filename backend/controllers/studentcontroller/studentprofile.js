const Student = require('../../models/student');

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Extract roll number from email (part before @)
    const rollNumber = student.emailId.split('@')[0];

    res.json({
      name: student.name,
      email: student.emailId,
      rollNumber: rollNumber,
      branch: student.branch || '',
      cgpa: student.cgpa || 0,
      sgpa: student.sgpa || [],
      domain: student.domain || [],
      isregistered: student.isregistered
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentProfileById = async (req, res) => {
  try {
    // Allow admin and company to access this
    if (req.user.role !== 'admin' && req.user.role !== 'company') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Extract roll number from email (part before @)
    const rollNumber = student.emailId.split('@')[0];

    res.json({
      name: student.name,
      email: student.emailId,
      rollNumber: rollNumber,
      branch: student.branch || '',
      cgpa: student.cgpa || 0,
      sgpa: student.sgpa || [],
      domain: student.domain || [],
      isregistered: student.isregistered
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const { branch, sgpa, domain } = req.body;

    // Calculate CGPA as average of 6 sgpa values
    let cgpa = 0;
    if (sgpa && Array.isArray(sgpa) && sgpa.length === 6) {
      cgpa = sgpa.reduce((sum, val) => sum + val, 0) / 6;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.user._id,
      {
        branch,
        sgpa,
        cgpa,
        domain,
        isregistered: true
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      student: {
        name: updatedStudent.name,
        email: updatedStudent.emailId,
        rollNumber: updatedStudent.emailId.split('@')[0],
        branch: updatedStudent.branch,
        cgpa: updatedStudent.cgpa,
        sgpa: updatedStudent.sgpa,
        domain: updatedStudent.domain,
        isregistered: updatedStudent.isregistered
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStudentProfile, getStudentProfileById, updateStudentProfile };
