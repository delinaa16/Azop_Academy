const Program = require("../models/Program");

// Create new program
exports.createProgram = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : "";
    const newProgram = new Program({ ...req.body, image });
    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all programs
exports.getPrograms = async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
