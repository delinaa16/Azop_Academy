const express = require("express");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const {
  uploadGalleryImages,
  getGallery,
  getGalleryById,
  updateGallery,
  addImagesToGallery,
  deleteImageFromGallery,
  deleteGallery,
  deleteAllGallery,
} = require("../controllers/galleryController");

const router = express.Router();

// Upload multiple images (max 10)
router.post("/", auth, upload.array("images", 10), uploadGalleryImages);

// Get all gallery entries
router.get("/", getGallery);

// Get one gallery entry
router.get("/:id", getGalleryById);

// Replace images
router.put("/:id", auth, upload.array("images", 10), updateGallery);

// Add images to entry
router.post("/:id/images", auth, upload.array("images", 10), addImagesToGallery);

// Delete single image from entry
router.delete("/:galleryId/images/:imageName", auth, deleteImageFromGallery);

// Delete one entry
router.delete("/:id", auth, deleteGallery);

// Delete all entries
router.delete("/", auth, deleteAllGallery);

module.exports = router;
