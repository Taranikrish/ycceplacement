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
   branch: {           // <-- added branch
    type: String,
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
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', jobSchema);
