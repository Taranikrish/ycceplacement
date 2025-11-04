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
    sgpa:{
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
    }
},{timestamps:true,});

const Student = mongoose.model('Student',student);
module.exports = Student;