
const Student = require('../../models/student');

const studentsearch = async (req, res) => {
    try {
        const query = req.query.q; // e.g. /api/students/search?q=s
        if (!query?.trim()) return res.json([]);

        // Case-insensitive partial match for name or emailId
        const students = await Student.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { emailId: { $regex: query, $options: 'i' } }
            ]
        }).limit(10); // Limit to 10 results

        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = studentsearch;