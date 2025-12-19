require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");

// Routes
const teacherRoutes = require("./routes/teacherRoutes");
const programRoutes = require("./routes/programRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const waitlistRoutes = require("./routes/waitlistRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const exportRoutes = require("./routes/exportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// Error handler middleware
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Connect Database (non-fatal if MongoDB is down; will keep retrying)
connectDB();

// Middlewares
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend (single origin integration)
app.use("/", express.static(path.join(__dirname, "..", "frontend")));

// API Routes
// If DB isn't connected, return a clean 503 for DB-backed endpoints
app.use("/api", (req, res, next) => {
  if (req.path === "/health") return next();
  if (!connectDB.isConnected || connectDB.isConnected() !== true) {
    return res.status(503).json({
      message: "Database not connected. Start MongoDB and retry.",
    });
  }
  next();
});

app.use("/api/teachers", teacherRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
// Backwards-compatible alias (frontend had /api/contacts)
app.use("/api/contacts", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/stats", async (req, res, next) => {
  try {
    const Teacher = require("./models/Teacher");
    const Program = require("./models/Program");
    const Gallery = require("./models/Gallery");
    const Contact = require("./models/Contact");

    const [teachers, programs, galleryEntries, unreadMessages] = await Promise.all([
      Teacher.countDocuments({ isActive: true }),
      Program.countDocuments({ isActive: true }),
      Gallery.countDocuments(),
      Contact.countDocuments({ status: "new", isArchived: false }),
    ]);

    res.json({ teachers, programs, galleryEntries, unreadMessages });
  } catch (e) {
    next(e);
  }
});

// SPA fallback (so refresh works) - Express 5 does not accept "*" as a string path
app.get(/^\/(?!api(?:\/|$)|uploads(?:\/|$)).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
