const Gallery = require("../models/Gallery");

// Upload multiple images
exports.uploadGalleryImages = async (req, res) => {
  try {
    const images = req.files.map(file => file.filename);
    const newGallery = new Gallery({ images });
    await newGallery.save();

    res.status(201).json(newGallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all gallery images
exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
