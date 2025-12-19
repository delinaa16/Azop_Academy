/**
 * Script to create admin account automatically
 * Run: node scripts/createAdmin.js
 * Or with custom credentials: node scripts/createAdmin.js username password
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_me";

// Get username and password from command line arguments or use defaults
const username = process.argv[2] || "admin";
const password = process.argv[3] || "admin123";

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("✓ Connected to MongoDB\n");

    // Check if admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log("⚠ Admin account already exists!");
      console.log("   If you want to create a new admin, delete the existing one first.");
      console.log("   Or use the login endpoint: POST /api/admin/login\n");
      
      // Show existing admin info (without password)
      const existingAdmin = await Admin.findOne();
      console.log(`   Existing admin username: ${existingAdmin.username}`);
      
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log("Creating admin account...");
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}\n`);

    // Create admin (password will be hashed automatically by the model)
    const admin = await Admin.create({ username, password });
    
    // Generate token
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1d" });

    console.log("✓ Admin account created successfully!\n");
    console.log("📋 Login Credentials:");
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}\n`);
    console.log("🔑 Your JWT Token (use this for API calls):");
    console.log(`   ${token}\n`);
    console.log("💡 To login via API:");
    console.log(`   POST http://localhost:5000/api/admin/login`);
    console.log(`   Body: { "username": "${username}", "password": "${password}" }\n`);
    
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("\n✗ Error:", error.message);
    if (error.code === 11000) {
      console.error("   Username already exists. Try a different username.");
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();

