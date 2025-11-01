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
    role:{
        type:String,
        default:'company',
    },
    isVerified: {
        type: Boolean,
        default: false, // Admin will later approve (true)
    },
},{timestamps:true});
company.index({ name: 'text', emailId: 'text' });

const Company = mongoose.model('company',company);
module.exports = Company;