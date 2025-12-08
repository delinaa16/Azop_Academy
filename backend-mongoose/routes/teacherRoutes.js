const express = require("express");
const router = express.Router;
const{getTeacher, addTeacher}= require('../controllers/teacherController')
const upload = require('../midelware/upload');

//
router.get("/",getTeachers);

router.post("/",postTeachers);

module.exports = router;