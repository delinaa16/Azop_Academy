const Settings = require("../models/Settings");

/**
 * Get all settings or by category
 */
exports.getSettings = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const settings = await Settings.find(filter).sort({ category: 1, key: 1 });
    
    // Convert to key-value object if requested
    if (req.query.format === "object") {
      const settingsObj = {};
      settings.forEach((setting) => {
        settingsObj[setting.key] = setting.value;
      });
      return res.status(200).json({ success: true, data: settingsObj });
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single setting by key
 */
exports.getSettingByKey = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    if (!setting) return res.status(404).json({ message: "Setting not found" });
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create or update setting
 */
exports.upsertSetting = async (req, res) => {
  try {
    const { key, value, description, category } = req.body;
    
    const setting = await Settings.findOneAndUpdate(
      { key },
      { key, value, description, category: category || "general" },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Setting saved successfully",
      data: setting
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update multiple settings at once
 */
exports.bulkUpdateSettings = async (req, res) => {
  try {
    const { settings } = req.body; // Array of { key, value, description?, category? }
    
    if (!Array.isArray(settings)) {
      return res.status(400).json({ message: "Settings must be an array" });
    }

    const operations = settings.map((setting) => ({
      updateOne: {
        filter: { key: setting.key },
        update: {
          $set: {
            value: setting.value,
            ...(setting.description && { description: setting.description }),
            ...(setting.category && { category: setting.category })
          }
        },
        upsert: true
      }
    }));

    await Settings.bulkWrite(operations);
    res.status(200).json({ message: "Settings updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete setting
 */
exports.deleteSetting = async (req, res) => {
  try {
    const setting = await Settings.findOneAndDelete({ key: req.params.key });
    if (!setting) return res.status(404).json({ message: "Setting not found" });
    res.status(200).json({ message: "Setting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

