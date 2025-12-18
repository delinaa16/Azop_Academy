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
  searchTeachers // import the new search function
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

// DELETE
router.delete("/:id", auth, deleteTeacher);

module.exports = router;
