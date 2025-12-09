const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },        // Parent name
  phone: { type: String, required: true },       // Phone number
  message: { type: String, required: true },     // Message content
  date: { type: Date, default: Date.now },       // Submission date
});

module.exports = mongoose.model("Contact", contactSchema);
