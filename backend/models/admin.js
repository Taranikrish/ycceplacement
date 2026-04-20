const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  googleId:{
    type:String,
    required: true,
    unique: true
  },
  name:{
    type:String,
    required: true
  },
  emailId:{
    type:String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
}
},{timestamps:true});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
