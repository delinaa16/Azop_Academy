// Import mongoose to create schemas and models
const mongoose = require("mongoose");

// Define the structure of a Teacher document
const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: ""
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Export the model so controllers can use it
module.exports = mongoose.model("Teacher", teacherSchema);
