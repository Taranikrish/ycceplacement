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
    },
    role:{
        type:String,
        default:'student'
    }
},{timestamps:true,});

const Student = mongoose.model('student',student);
module.exports = Student;