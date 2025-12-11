// Import mongoose to create schemas and models
const mongoose = require("mongoose");

// Define the structure of a Program document
const programSchema = new mongoose.Schema({
    title: {
        type: String,       // Program title (e.g., "Kindergarten Level 1")
        required: true      // This field is mandatory
    },
    description: {
        type: String,       // Optional description of the program
        default: ""         // Defaults to empty string if not provided
    },
    duration: {
        type: String,       // Duration of the program (e.g., "3 months")
        default: ""         // Optional; defaults to empty string
    },
    image: {
        type: String,       // Stores the filename of the uploaded program image
        default: ""         // Optional; empty string if no image uploaded
    }
}, {
    timestamps: true         // Automatically adds createdAt and updatedAt fields
});

// Export the model so controllers can use it
module.exports = mongoose.model("Program", programSchema);
