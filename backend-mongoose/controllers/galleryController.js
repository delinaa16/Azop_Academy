const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");

const uploadsImagesDir = path.join(__dirname, "..", "uploads", "images");

// Upload multiple images and create a new gallery entry
exports.uploadGalleryImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const images = req.files.map(file => file.filename);
    const newGallery = new Gallery({ images });
    await newGallery.save();

    res.status(201).json({
      message: "Gallery images uploaded successfully",
      data: newGallery
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all gallery entries, optionally filtered by query
exports.getGallery = async (req, res) => {
  try {
    const query = {};
    if (req.query.recent === "true") {
      const gallery = await Gallery.find().sort({ createdAt: -1 }).limit(5);
      return res.json(gallery);
    }

    const gallery = await Gallery.find(query).sort({ createdAt: -1 });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single gallery entry by ID
exports.getGalleryById = async (req, res) => {
  try {
    const entry = await Gallery.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Gallery entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update gallery images (replace existing images) by ID
exports.updateGallery = async (req, res) => {
  try {
    const entry = await Gallery.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Gallery entry not found" });

    if (req.files && req.files.length > 0) {
      entry.images.forEach(file => {
        const filePath = path.join(uploadsImagesDir, file);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

      entry.images = req.files.map(file => file.filename);
      await entry.save();
    }

    res.json({ message: "Gallery updated successfully", data: entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add additional images to existing gallery entry without replacing
exports.addImagesToGallery = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const entry = await Gallery.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Gallery entry not found" });

    const newImages = req.files.map(file => file.filename);
    entry.images.push(...newImages);
    await entry.save();

    res.json({ message: "Images added successfully", data: entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a single image from a gallery entry
exports.deleteImageFromGallery = async (req, res) => {
  try {
    const { galleryId, imageName } = req.params;
    const entry = await Gallery.findById(galleryId);
    if (!entry) return res.status(404).json({ message: "Gallery entry not found" });

    if (!entry.images.includes(imageName)) {
      return res.status(404).json({ message: "Image not found in this gallery" });
    }

    entry.images = entry.images.filter(img => img !== imageName);
    const filePath = path.join(uploadsImagesDir, imageName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await entry.save();
    res.json({ message: "Image deleted successfully", data: entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a single gallery entry
exports.deleteGallery = async (req, res) => {
  try {
    const entry = await Gallery.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Gallery entry not found" });

    entry.images.forEach(file => {
      const filePath = path.join(uploadsImagesDir, file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    res.json({ message: "Gallery entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete all gallery entries
exports.deleteAllGallery = async (req, res) => {
  try {
    const entries = await Gallery.find();
    entries.forEach(entry => {
      entry.images.forEach(file => {
        const filePath = path.join(uploadsImagesDir, file);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    });

    await Gallery.deleteMany({});
    res.json({ message: "All gallery entries deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
