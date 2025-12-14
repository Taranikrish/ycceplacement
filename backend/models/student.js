const mongoose = require('mongoose')

const student = new mongoose.Schema({
    googleId:{
        type:String,
    },
    name:{
        type:String,
    },
    emailId:{
        type:String,
        required: true,
        unique: true
    },
    rollNumber:{
        type:String,
    },
    branch:{
        type:String,
    },
    cgpa:{
        type:Number,
    },
    mobileNumber:{
        type:String,
    },
    sgpa: {
        type:[Number],
        required: true
    },
    role:{
        type:String,
        default:'student'
    },
    domain:{
        type:[String],
        default:[]
    },
    isregistered:{
        type:Boolean,
        default:false
    },
    profilePhoto: {
    type: String,
    default: null,
  },
  profilePhotoPublicId: {
    type: String,
    default: null,
  },
  resumePdf: {
    type: String,
    default: null,
  },
  resumePdfPublicId: {
    type: String,
    default: null,
  },
  resumeVideo: {
    type: String,
    default: null,
  },
    resumeVideoPublicId: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        default: '',
        lowercase: true,
        trim:true
    },
    city: {
        type: String,
        default: '',
        lowercase: true,
        trim: true
    },
    state: {
        type: String,
        default: '',
        lowercase: true,
        trim: true
    },
    pin: {
        type: String,
        default: '',
    },
},{timestamps:true,});

const Student = mongoose.model('Student',student);
module.exports = Student;
