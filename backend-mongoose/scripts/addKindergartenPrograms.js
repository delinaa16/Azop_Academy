/**
 * Script to add kindergarten programs in Amharic and English
 * Run: node scripts/addKindergartenPrograms.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Program = require("../models/Program");

const MONGO_URL = process.env.MONGO_URL;

const programs = [
  {
    title: "አማርኛ (Amharic)",
    description: "Learning Amharic language through stories, songs, and fun activities. Children develop reading and writing skills in their native language.",
    duration: "Daily",
    isActive: true,
    order: 1
  },
  {
    title: "ሂሳብ (Math)",
    description: "Fun math activities using games, counting, shapes, and numbers. Building early math skills through play and exploration.",
    duration: "Daily",
    isActive: true,
    order: 2
  },
  {
    title: "አካባቢ ሳይንስ (Environmental Science)",
    description: "Exploring nature, plants, animals, and the environment. Hands-on science activities that spark curiosity about the world around us.",
    duration: "Weekly",
    isActive: true,
    order: 3
  },
  {
    title: "የህጻናት መዝሙር (Children's Songs & Music)",
    description: "Singing, dancing, and music activities. Children learn rhythm, melody, and express themselves through music and movement.",
    duration: "Daily",
    isActive: true,
    order: 4
  },
  {
    title: "ፊልም (Film & Media)",
    description: "Age-appropriate educational videos and storytelling. Learning through visual media and creative storytelling.",
    duration: "Weekly",
    isActive: true,
    order: 5
  },
  {
    title: "Drawing & Art",
    description: "Creative art activities including drawing, coloring, painting, and crafts. Developing fine motor skills and artistic expression.",
    duration: "Daily",
    isActive: true,
    order: 6
  },
  {
    title: "English",
    description: "Learning English through games, songs, and interactive activities. Building vocabulary and language skills in a fun way.",
    duration: "Daily",
    isActive: true,
    order: 7
  },
  {
    title: "Playing Activities",
    description: "Structured play activities that promote social skills, creativity, and physical development. Learning through play!",
    duration: "Daily",
    isActive: true,
    order: 8
  }
];

async function addPrograms() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("✓ Connected to MongoDB\n");

    console.log(`Adding ${programs.length} programs...\n`);

    for (let i = 0; i < programs.length; i++) {
      const program = programs[i];
      
      // Check if program already exists
      const existing = await Program.findOne({ title: program.title });
      if (existing) {
        console.log(`⚠ Program "${program.title}" already exists, skipping...`);
        continue;
      }

      const newProgram = new Program(program);
      await newProgram.save();
      console.log(`✓ Added: ${program.title}`);
    }

    console.log(`\n✓ Successfully added programs!`);
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("\n✗ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

addPrograms();

