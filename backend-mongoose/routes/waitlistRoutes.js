const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createWaitlistEntry,
  getWaitlistEntries,
  getWaitlistEntryById,
  updateWaitlistEntry,
  deleteWaitlistEntry,
  bulkUpdateWaitlist,
  getWaitlistStats,
  getPendingWaitlist
} = require("../controllers/waitlistController");

// Public: Create waitlist entry (from website)
router.post("/", createWaitlistEntry);

// Admin: Get all waitlist entries (with filtering)
router.get("/", auth, getWaitlistEntries);

// Admin: Get waitlist statistics
router.get("/stats", auth, getWaitlistStats);

// Admin: Get pending waitlist (priority sorted)
router.get("/pending", auth, getPendingWaitlist);

// Admin: Get single entry
router.get("/:id", auth, getWaitlistEntryById);

// Admin: Update entry
router.put("/:id", auth, updateWaitlistEntry);

// Admin: Bulk update
router.patch("/bulk/update", auth, bulkUpdateWaitlist);

// Admin: Delete entry
router.delete("/:id", auth, deleteWaitlistEntry);

module.exports = router;

