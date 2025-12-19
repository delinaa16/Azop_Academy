const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  exportTeachers,
  exportPrograms,
  exportContacts,
  exportWaitlist,
  exportJSON
} = require("../controllers/exportController");

// All export routes require authentication
router.get("/teachers/csv", auth, exportTeachers);
router.get("/programs/csv", auth, exportPrograms);
router.get("/contacts/csv", auth, exportContacts);
router.get("/waitlist/csv", auth, exportWaitlist);
router.get("/:type/json", auth, exportJSON);

module.exports = router;

