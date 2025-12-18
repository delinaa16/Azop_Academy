const Teacher = require("../models/Teacher");
const fs = require("fs");
const path = require("path");

const uploadsImagesDir = path.join(__dirname, "..", "uploads", "images");

// CREATE TEACHER
exports.createTeacher = async (req, res) => {
  try {
    const { name, subject, experience } = req.body;
    const photo = req.file ? req.file.filename : "";

    const newTeacher = new Teacher({ name, subject, experience, photo });
    await newTeacher.save();

    res.status(201).json({ message: "Teacher created successfully", data: newTeacher });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL TEACHERS (with optional search by name or subject)
exports.getAllTeachers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.name) filter.name = { $regex: req.query.name, $options: "i" };
    if (req.query.subject) filter.subject = { $regex: req.query.subject, $options: "i" };
    if (typeof req.query.isActive !== "undefined") {
      filter.isActive = req.query.isActive === "true";
    }

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 100);

    const [data, total] = await Promise.all([
      Teacher.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Teacher.countDocuments(filter),
    ]);

    // keep backwards compatibility: if client expects an array, allow ?raw=true
    if (req.query.raw === "true") return res.status(200).json(data);

    res.status(200).json({ total, page, limit, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SEARCH TEACHERS (alias endpoint)
exports.searchTeachers = async (req, res) => {
  try {
    const { name, subject, q } = req.query;
    const filter = {};
    const term = q || name;
    if (term) filter.name = { $regex: term, $options: "i" };
    if (subject) filter.subject = { $regex: subject, $options: "i" };

    const teachers = await Teacher.find(filter).sort({ order: 1, createdAt: -1 }).limit(50);
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TEACHER BY ID
exports.getTeachersById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TEACHER (with optional photo update)
exports.updateTeachers = async (req, res) => {
  try {
    const { name, subject, experience } = req.body;
    const photo = req.file ? req.file.filename : undefined;

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // Delete old photo if new one is uploaded
    if (photo && teacher.photo) {
      const oldPhotoPath = path.join(uploadsImagesDir, teacher.photo);
      if (fs.existsSync(oldPhotoPath)) fs.unlinkSync(oldPhotoPath);
    }

    teacher.name = name || teacher.name;
    teacher.subject = subject || teacher.subject;
    teacher.experience = experience || teacher.experience;
    if (photo) teacher.photo = photo;

    await teacher.save();
    res.status(200).json({ message: "Teacher updated successfully", data: teacher });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE TEACHER
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // Delete photo file
    if (teacher.photo) {
      const photoPath = path.join(uploadsImagesDir, teacher.photo);
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    }

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ALL TEACHERS
exports.deleteAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    for (let teacher of teachers) {
      if (teacher.photo) {
        const photoPath = path.join(uploadsImagesDir, teacher.photo);
        if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
      }
    }
    await Teacher.deleteMany({});
    res.status(200).json({ message: "All teachers deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
