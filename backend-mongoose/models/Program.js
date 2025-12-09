const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },      // Name of the program
  description: { type: String },                // Details
  image: { type: String, default: "" },         // Program image
});

module.exports = mongoose.model("Program", programSchema);
