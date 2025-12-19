const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getSettings,
  getSettingByKey,
  upsertSetting,
  bulkUpdateSettings,
  deleteSetting
} = require("../controllers/settingsController");

// All settings routes require authentication
router.get("/", auth, getSettings);
router.get("/:key", auth, getSettingByKey);
router.post("/", auth, upsertSetting);
router.put("/bulk", auth, bulkUpdateSettings);
router.delete("/:key", auth, deleteSetting);

module.exports = router;

