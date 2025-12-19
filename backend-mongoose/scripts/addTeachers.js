/**
 * Script to add teachers to Azop Kindergarten
 * Run: node scripts/addTeachers.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Teacher = require("../models/Teacher");

const MONGO_URL = process.env.MONGO_URL;

const teachers = [
  // KG1 Main Teachers
  {
    name: "Miss Ayalnesh Dagne",
    subject: "KG1 - Main Teacher",
    experience: "11 years in the school",
    bio: "Main teacher for KG1 with 11 years of experience at Azop Kindergarten. Dedicated to nurturing young learners.",
    isActive: true,
    order: 1
  },
  {
    name: "Miss Tirfewerk Dechasa",
    subject: "KG1 - Main Teacher",
    experience: "11 years in the school",
    bio: "Main teacher for KG1 with 11 years of experience at Azop Kindergarten. Passionate about early childhood education.",
    isActive: true,
    order: 2
  },
  
  // KG2 Main Teachers
  {
    name: "Miss Hirut",
    subject: "KG2 - Main Teacher",
    experience: "6 years",
    bio: "Main teacher for KG2 with 6 years of teaching experience. Creating engaging learning experiences for young children.",
    isActive: true,
    order: 3
  },
  {
    name: "Miss Atse",
    subject: "KG2 - Main Teacher",
    experience: "3 years",
    bio: "Main teacher for KG2 with 3 years of experience. Focused on play-based learning and child development.",
    isActive: true,
    order: 4
  },
  
  // KG3 Main Teachers
  {
    name: "Miss Mahlet",
    subject: "KG3 - Main Teacher",
    experience: "1 year",
    bio: "Main teacher for KG3. Bringing fresh energy and innovative teaching methods to prepare children for primary school.",
    isActive: true,
    order: 5
  },
  {
    name: "Miss Samarwit",
    subject: "KG3 - Main Teacher",
    experience: "7 years",
    bio: "Main teacher for KG3 with 7 years of experience. Expert in preparing children for their next educational journey.",
    isActive: true,
    order: 6
  },
  
  // Assistant Teachers
  {
    name: "Miss Kalkidan Nebiyu",
    subject: "Assistant Teacher",
    experience: "5 years",
    bio: "Assistant teacher with 5 years of experience. Supporting main teachers and providing individual attention to children.",
    isActive: true,
    order: 7
  },
  {
    name: "Miss Belay",
    subject: "Assistant Teacher",
    experience: "3 years",
    bio: "Assistant teacher with 3 years of experience. Helping create a nurturing and supportive learning environment.",
    isActive: true,
    order: 8
  }
];

async function addTeachers() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("✓ Connected to MongoDB\n");

    console.log(`Adding ${teachers.length} teachers...\n`);

    for (let i = 0; i < teachers.length; i++) {
      const teacherData = teachers[i];
      
      // Check if teacher already exists
      const existing = await Teacher.findOne({ name: teacherData.name });
      if (existing) {
        console.log(`⚠ Teacher "${teacherData.name}" already exists, skipping...`);
        continue;
      }

      const newTeacher = new Teacher(teacherData);
      await newTeacher.save();
      console.log(`✓ Added: ${teacherData.name} - ${teacherData.subject}`);
    }

    console.log(`\n✓ Successfully added ${teachers.length} teachers!`);
    
    // Show summary
    const totalTeachers = await Teacher.countDocuments();
    const kg1Teachers = await Teacher.countDocuments({ subject: /KG1/ });
    const kg2Teachers = await Teacher.countDocuments({ subject: /KG2/ });
    const kg3Teachers = await Teacher.countDocuments({ subject: /KG3/ });
    const assistants = await Teacher.countDocuments({ subject: /Assistant/ });
    
    console.log("\n📊 Summary:");
    console.log(`   Total Teachers: ${totalTeachers}`);
    console.log(`   KG1 Teachers: ${kg1Teachers}`);
    console.log(`   KG2 Teachers: ${kg2Teachers}`);
    console.log(`   KG3 Teachers: ${kg3Teachers}`);
    console.log(`   Assistant Teachers: ${assistants}`);
    
    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("\n✗ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

addTeachers();

