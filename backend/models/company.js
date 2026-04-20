const mongoose = require('mongoose')

const company = new mongoose.Schema({
    googleId:{
        type:String,
        required:true,
        unique:true,
    },
    emailId:{
        type:String,
        unique:true,
        required: true,
    },
    name:{
        type:String,
        required: true,
    },
    phoneNumber:{
        type:String,
        required: false,
    },
    location:{
        type:String,
        required: false,
    },
    contactPerson:{
        type:String,
        required: false,
    },
    
    role:{
        type:String,
        default:'company',
    },
    linkedInUrl:{
        type:String,
        required: false,
        trim: true
    },
    dpiitNumber:{
      type:String,
    //   required: true,  
    },
    isVerified: {
        type: Boolean,
        default: false, // Admin will later approve (true)
    },
},{timestamps:true});
company.index({ name: 'text', emailId: 'text' });

const Company = mongoose.model('Company',company);
module.exports = Company;