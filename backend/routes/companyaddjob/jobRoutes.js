// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const { addJob } = require('../../controllers/companyjob/jobController');

router.post('/add', addJob);
module.exports = router;
