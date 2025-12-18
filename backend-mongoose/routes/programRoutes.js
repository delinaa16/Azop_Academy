const express = require("express");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  deleteAllPrograms,
  bulkUpdatePrograms,
} = require("../controllers/programController");

const router = express.Router();

// Create Program (with image upload)
router.post("/", auth, upload.single("image"), createProgram);

// Get all programs
router.get("/", getPrograms);

// Get one program
router.get("/:id", getProgramById);

// Update program
router.put("/:id", auth, upload.single("image"), updateProgram);

// Delete program
router.delete("/:id", auth, deleteProgram);

// Bulk update programs
router.patch("/bulk/update", auth, bulkUpdatePrograms);

// Delete all programs
router.delete("/", auth, deleteAllPrograms);

module.exports = router;
