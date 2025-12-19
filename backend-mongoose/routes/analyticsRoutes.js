const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getDashboardStats,
  getActivityTrends,
  getProgramAnalytics
} = require("../controllers/analyticsController");

// All analytics routes require authentication
router.get("/dashboard", auth, getDashboardStats);
router.get("/trends", auth, getActivityTrends);
router.get("/programs", auth, getProgramAnalytics);

module.exports = router;

