const express = require('express');
const router = express.Router();
const Student = require('../../models/student');
const { requireAuth, requireRole } = require('../../middleware/auth');
const searchStudents = require('../../controllers/admincontroller/studentsearch').searchStudents;
// Get all students
router.get('/', requireAuth, requireRole(['admin', 'company']), async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search API with filter + pagination
router.get('/search', requireAuth, requireRole('admin'), searchStudents); //  use controller

module.exports = router;
