const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
  },
  location: {
    type: String,
  },
  branch: {
    type: [String],
    default: [],
  },
  deadline: {
    type: Date,
  },
  jd_file:{
    type: String,
    default: null
  },
  jd_public_id: {
    type: String,
    default: null
  },
  // NEW FIELDS
  isApproved: {
    type: Boolean,
    default: false,  // Jobs start as not approved
  },
  visibleToStudents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Student',
    default: [],  // Array of student IDs who can see this job
  },
  isVisibleToAll: {
    type: Boolean,
    default: false,  // If true, all students can see
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', jobSchema);