const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  images: [{ type: String }],                   // Array of image filenames
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("Gallery", gallerySchema);
