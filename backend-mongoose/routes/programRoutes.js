const express = require("express");
const upload = require("../middleware/upload");
const { createProgram, getPrograms } = require("../controllers/programController");

const router = express.Router();

// Create Program (with image upload)
router.post("/", upload.single("image"), createProgram);

// Get all programs
router.get("/", getPrograms);

module.exports = router;
