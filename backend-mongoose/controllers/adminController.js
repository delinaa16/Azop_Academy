const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const signToken = (adminId) =>
  jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Admin login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(admin._id);
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register first admin (allowed only if no admin exists yet)
exports.registerFirstAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "username and password are required" });

    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ message: "Admin already exists. Use login." });
    }

    const admin = await Admin.create({ username, password });
    const token = signToken(admin._id);
    res.status(201).json({ message: "Admin created", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
