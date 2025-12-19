const Teacher = require("../models/Teacher");
const fs = require("fs");
const path = require("path");
const {
  parsePagination,
  buildPaginationMeta,
  parseSort,
  buildTextSearch,
  buildAdvancedFilter
} = require("../utils/queryHelpers");

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

// GET ALL TEACHERS (with advanced filtering, sorting, and pagination)
exports.getAllTeachers = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const sort = parseSort(req, { order: 1, createdAt: -1 });

    // Build filter
    let filter = {};

    // Basic filters
    if (req.query.name) filter.name = { $regex: req.query.name, $options: "i" };
    if (req.query.subject) filter.subject = { $regex: req.query.subject, $options: "i" };
    if (typeof req.query.isActive !== "undefined") {
      filter.isActive = req.query.isActive === "true";
    }

    // Advanced search
    if (req.query.search) {
      const searchFilter = buildTextSearch(req.query.search, ["name", "subject", "bio"]);
      filter = { ...filter, ...searchFilter };
    }

    // Advanced filters
    const advancedFilter = buildAdvancedFilter(req, ["isActive", "order"]);
    filter = { ...filter, ...advancedFilter };

    const [data, total] = await Promise.all([
      Teacher.find(filter).sort(sort).skip(skip).limit(limit),
      Teacher.countDocuments(filter)
    ]);

    // Backwards compatibility: if client expects an array, allow ?raw=true
    if (req.query.raw === "true") return res.status(200).json(data);

    const meta = buildPaginationMeta(page, limit, total);
    res.status(200).json({ success: true, data, meta });
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

    // Update fields
    if (name !== undefined) teacher.name = name;
    if (subject !== undefined) teacher.subject = subject;
    if (experience !== undefined) teacher.experience = experience;
    if (req.body.bio !== undefined) teacher.bio = req.body.bio;
    if (req.body.isActive !== undefined) teacher.isActive = req.body.isActive;
    if (req.body.order !== undefined) teacher.order = req.body.order;
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

// BULK UPDATE TEACHERS
exports.bulkUpdateTeachers = async (req, res) => {
  try {
    const { ids, updateData } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "IDs array is required" });
    }

    const result = await Teacher.updateMany(
      { _id: { $in: ids } },
      updateData,
      { runValidators: true }
    );

    res.status(200).json({
      message: "Teachers updated successfully",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REORDER TEACHERS
exports.reorderTeachers = async (req, res) => {
  try {
    const { orderMap } = req.body; // { teacherId: order, ... }
    if (!orderMap || typeof orderMap !== "object") {
      return res.status(400).json({ message: "orderMap object is required" });
    }

    const updates = Object.keys(orderMap).map((id) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: orderMap[id] } }
      }
    }));

    await Teacher.bulkWrite(updates);
    res.status(200).json({ message: "Teachers reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TEACHER STATISTICS
exports.getTeacherStats = async (req, res) => {
  try {
    const total = await Teacher.countDocuments();
    const active = await Teacher.countDocuments({ isActive: true });
    const inactive = total - active;

    const bySubject = await Teacher.aggregate([
      {
        $group: {
          _id: "$subject",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
        bySubject
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
