const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    subject:{
        type: String,
        required:true,
    },
    experience:{
        type: String,
        required:true,
    },
    photo:{
        type: String,
        default: "",
    },
});