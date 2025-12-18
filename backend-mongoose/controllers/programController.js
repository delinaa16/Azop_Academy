const Program = require("../models/Program");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");

const uploadsImagesDir = path.join(__dirname, "..", "uploads", "images");

// CREATE NEW PROGRAM
exports.createProgram = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const image = req.file ? req.file.filename : "";
    const newProgram = new Program({ ...req.body, image });
    await newProgram.save();

    res.status(201).json({ message: "Program created successfully", data: newProgram });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL PROGRAMS WITH FILTER, SEARCH, SORT, AND PAGINATION
exports.getPrograms = async (req, res) => {
  try {
    const filter = {};
    const { title, duration, startDate, endDate } = req.query;

    if (title) filter.title = { $regex: title, $options: "i" };
    if (duration) filter.duration = duration;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const programs = await Program.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Program.countDocuments(filter);

    res.json({ total, page, limit, data: programs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE PROGRAM BY ID
exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json(program);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROGRAM BY ID
exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });

    // Remove old image if a new one is uploaded
    if (req.file && program.image) {
      const oldImagePath = path.join(uploadsImagesDir, program.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const image = req.file ? req.file.filename : program.image;

    program.title = req.body.title || program.title;
    program.description = req.body.description || program.description;
    program.duration = req.body.duration || program.duration;
    program.image = image;

    await program.save();
    res.json({ message: "Program updated successfully", data: program });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE PROGRAM BY ID (Soft Delete Optional)
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });

    // Remove image from server
    if (program.image) {
      const imagePath = path.join(uploadsImagesDir, program.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    // Soft delete: mark as deleted instead of removing
    // program.isDeleted = true;
    // await program.save();

    // Hard delete:
    await program.deleteOne();

    res.json({ message: "Program deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ALL PROGRAMS
exports.deleteAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find();
    for (let program of programs) {
      if (program.image) {
        const imagePath = path.join(uploadsImagesDir, program.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
    }
    await Program.deleteMany({});
    res.json({ message: "All programs deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// BULK UPDATE PROGRAMS
exports.bulkUpdatePrograms = async (req, res) => {
  try {
    const { ids, updateData } = req.body;
    const result = await Program.updateMany({ _id: { $in: ids } }, updateData, { runValidators: true });
    res.json({ message: "Programs updated successfully", modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
