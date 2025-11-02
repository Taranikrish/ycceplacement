// models/job.js
const mongoose = require('mongoose');
const Company = require('./company');

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  emailId:{
        type:String,
        required: true,
        // match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  salary: {
    type: String,
  },
  deadline: {
    type: Date,
  }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
