const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  googleId:{
    type:String,

  },
  name:{
    type:String,
  },
  emailId:{
    type:String,
  },
  role: { 
    type: String, 
    default: 'admin' 
}
},{timestamps:true});

module.exports = mongoose.model('Admin', adminSchema);
