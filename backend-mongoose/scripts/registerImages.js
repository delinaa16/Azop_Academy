/**
 * Script to register images from uploads/images folder to gallery
 * Run: node scripts/registerImages.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Gallery = require("../models/Gallery");

const MONGO_URL = process.env.MONGO_URL;
const IMAGES_DIR = path.join(__dirname, "..", "uploads", "images");

// Image extensions to include
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];

async function registerImages() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("✓ Connected to MongoDB");

    // Read all files from images directory
    console.log(`\nReading images from: ${IMAGES_DIR}`);
    if (!fs.existsSync(IMAGES_DIR)) {
      console.error(`✗ Directory does not exist: ${IMAGES_DIR}`);
      console.log(`\nCreating directory...`);
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
      console.log("✓ Directory created. Please add images and run again.");
      process.exit(0);
    }

    const allFiles = fs.readdirSync(IMAGES_DIR);
    const imageFiles = allFiles.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log("✗ No image files found in the directory.");
      console.log(`\nPlease add images to: ${IMAGES_DIR}`);
      process.exit(0);
    }

    console.log(`✓ Found ${imageFiles.length} image(s)`);

    // Check which images are already in the database
    const existingEntries = await Gallery.find({});
    const existingImages = new Set();
    existingEntries.forEach((entry) => {
      entry.images.forEach((img) => existingImages.add(img));
    });

    const newImages = imageFiles.filter((img) => !existingImages.has(img));

    if (newImages.length === 0) {
      console.log("\n✓ All images are already registered in the database.");
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`\n${newImages.length} new image(s) to register`);

    // Group images (10 per gallery entry, or you can change this)
    const IMAGES_PER_ENTRY = 10;
    const groups = [];
    for (let i = 0; i < newImages.length; i += IMAGES_PER_ENTRY) {
      groups.push(newImages.slice(i, i + IMAGES_PER_ENTRY));
    }

    console.log(`\nCreating ${groups.length} gallery entry/entries...`);

    // Create gallery entries
    for (let i = 0; i < groups.length; i++) {
      const imageGroup = groups[i];
      const galleryEntry = new Gallery({
        images: imageGroup,
        title: `Student Gallery ${i + 1}`,
        description: `Collection of student photos - Set ${i + 1}`,
        category: "students",
      });

      await galleryEntry.save();
      console.log(`✓ Registered ${imageGroup.length} image(s) in entry ${i + 1}`);
    }

    console.log(`\n✓ Successfully registered ${newImages.length} image(s) in ${groups.length} gallery entry/entries!`);
    
    // Show summary
    const totalEntries = await Gallery.countDocuments();
    const totalImagesInDB = await Gallery.aggregate([
      {
        $project: {
          imageCount: { $size: "$images" }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$imageCount" }
        }
      }
    ]);
    
    console.log("\n📊 Summary:");
    console.log(`   Gallery Entries: ${totalEntries}`);
    console.log(`   Total Images Registered: ${totalImagesInDB[0]?.total || 0}`);
    
    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("\n✗ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

registerImages();

