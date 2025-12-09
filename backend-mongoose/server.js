require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// Routes
const teacherRoutes = require("./routes/teacherRoutes");
const programRoutes = require("./routes/programRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Error handler middleware
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/teachers", teacherRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
