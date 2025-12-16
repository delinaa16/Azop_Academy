const Teacher = require("../models/Teacher");

// CREATE TEACHER
exports.createTeacher = async (req, res) => {
  try {
    const { name, subject, experience } = req.body;
    const photo = req.file ? req.file.filename : "";

    const newTeacher = new Teacher({
      name,
      subject,
      experience,
      photo
    });

    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL TEACHERS
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TEACHER BY ID
exports.getTeachersById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id); // fixed req.param → req.params
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Teacher not found" });
  }
};

// UPDATE TEACHER
exports.updateTeachers = async (req, res) => {
  try {
    const { name, subject, experience } = req.body;
    const photo = req.file ? req.file.filename : undefined;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id, // fixed req.param → req.params
      {
        name,
        subject,
        experience,
        ...(photo && { photo }) // only add photo if it exists
      },
      { new: true, runValidators: true } // return updated document and validate
    );

    if (!updatedTeacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE TEACHER
exports.deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id); // fixed function name & params
    if (!deletedTeacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json({ message: "Teacher deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
