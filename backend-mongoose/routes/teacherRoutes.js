const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

// CREATE (with photo upload)
router.post("/", upload.single("photo"), createTeacher);

// GET ALL
router.get("/", getTeachers);

// GET ONE
router.get("/:id", getTeacherById);

// UPDATE (with optional photo)
router.put("/:id", upload.single("photo"), updateTeacher);

// DELETE
router.delete("/:id", deleteTeacher);

module.exports = router;
