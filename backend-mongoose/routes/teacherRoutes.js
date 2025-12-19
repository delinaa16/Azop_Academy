const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const { 
  createTeacher, 
  getAllTeachers, 
  getTeachersById, 
  updateTeachers, 
  deleteTeacher, 
  deleteAllTeachers,
  searchTeachers,
  bulkUpdateTeachers,
  reorderTeachers,
  getTeacherStats
} = require("../controllers/teacherController");

// CREATE (with photo upload)
router.post("/", auth, upload.single("photo"), createTeacher);

// GET ALL
router.get("/", getAllTeachers);

// SEARCH
router.get("/search", searchTeachers); // new search route

// GET ONE
router.get("/:id", getTeachersById);

// UPDATE (with optional photo)
router.put("/:id", auth, upload.single("photo"), updateTeachers);

// BULK UPDATE
router.patch("/bulk/update", auth, bulkUpdateTeachers);

// REORDER TEACHERS
router.patch("/reorder", auth, reorderTeachers);

// GET STATISTICS
router.get("/stats", auth, getTeacherStats);

// DELETE
router.delete("/:id", auth, deleteTeacher);

// DELETE ALL
router.delete("/", auth, deleteAllTeachers);

module.exports = router;
