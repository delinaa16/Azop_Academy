const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// Import controller functions with correct names
const {
  createTeacher,
  getAllTeachers,
  getTeachersById,
  updateTeachers,
  deleteTeacher,
} = require("../controllers/teacherController");

// CREATE teacher (with optional photo upload)
router.post("/", upload.single("photo"), createTeacher);

// GET all teachers
router.get("/", getAllTeachers);

// GET a single teacher by ID
router.get("/:id", getTeachersById);

// UPDATE teacher (with optional photo upload)
router.put("/:id", upload.single("photo"), updateTeachers);

// DELETE teacher
router.delete("/:id", deleteTeacher);

module.exports = router;
