const express = require('express');
const router = express.Router();
// const Student = require('../models/student');
const studentsearch = require('../../controllers/admincontroller/studentsearch');
// Search API
router.get('/search',studentsearch);

module.exports = router;
