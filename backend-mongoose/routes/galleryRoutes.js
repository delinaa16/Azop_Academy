const express = require("express");
const upload = require("../middleware/upload");
const { uploadGalleryImages, getGallery } = require("../controllers/galleryController");

const router = express.Router();

// Upload multiple images (max 10)
router.post("/", upload.array("images", 10), uploadGalleryImages);

// Get all gallery entries
router.get("/", getGallery);

module.exports = router;
