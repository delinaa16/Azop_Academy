const Waitlist = require("../models/Waitlist");
const {
  parsePagination,
  buildPaginationMeta,
  parseSort,
  buildTextSearch,
  buildDateRange,
  buildAdvancedFilter
} = require("../utils/queryHelpers");

// CREATE WAITLIST ENTRY
exports.createWaitlistEntry = async (req, res) => {
  try {
    const { studentName, parentEmail, phone, programInterest, message } = req.body;

    // Check if email already exists in waitlist
    const existing = await Waitlist.findOne({ parentEmail, status: { $in: ["pending", "contacted"] } });
    if (existing) {
      return res.status(400).json({ message: "Email already exists in waitlist" });
    }

    const newEntry = new Waitlist({
      studentName,
      parentEmail,
      phone,
      programInterest,
      message
    });

    await newEntry.save();
    res.status(201).json({ message: "Added to waitlist successfully", data: newEntry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL WAITLIST ENTRIES (with advanced filtering)
exports.getWaitlistEntries = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const sort = parseSort(req, { createdAt: -1 });

    // Build filter
    let filter = {};

    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Search filter
    if (req.query.search) {
      const searchFilter = buildTextSearch(req.query.search, [
        "studentName",
        "parentEmail",
        "phone",
        "programInterest",
        "message"
      ]);
      filter = { ...filter, ...searchFilter };
    }

    // Date range filter
    const dateRange = buildDateRange(req);
    filter = { ...filter, ...dateRange };

    // Advanced filters
    const advancedFilter = buildAdvancedFilter(req, ["priority", "programInterest"]);
    filter = { ...filter, ...advancedFilter };

    // Query
    const [data, total] = await Promise.all([
      Waitlist.find(filter).sort(sort).skip(skip).limit(limit),
      Waitlist.countDocuments(filter)
    ]);

    const meta = buildPaginationMeta(page, limit, total);

    res.status(200).json({
      success: true,
      data,
      meta
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET WAITLIST ENTRY BY ID
exports.getWaitlistEntryById = async (req, res) => {
  try {
    const entry = await Waitlist.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Waitlist entry not found" });
    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE WAITLIST ENTRY
exports.updateWaitlistEntry = async (req, res) => {
  try {
    const { status, priority, notes } = req.body;
    const entry = await Waitlist.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Waitlist entry not found" });

    // Update fields
    if (status) {
      entry.status = status;
      if (status === "contacted" && !entry.contactedAt) {
        entry.contactedAt = new Date();
      }
      if (status === "enrolled" && !entry.enrolledAt) {
        entry.enrolledAt = new Date();
      }
    }
    if (priority !== undefined) entry.priority = priority;
    if (notes !== undefined) entry.notes = notes;

    await entry.save();
    res.status(200).json({ message: "Waitlist entry updated successfully", data: entry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE WAITLIST ENTRY
exports.deleteWaitlistEntry = async (req, res) => {
  try {
    const entry = await Waitlist.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Waitlist entry not found" });
    res.status(200).json({ message: "Waitlist entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BULK UPDATE WAITLIST ENTRIES
exports.bulkUpdateWaitlist = async (req, res) => {
  try {
    const { ids, updateData } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "IDs array is required" });
    }

    const result = await Waitlist.updateMany(
      { _id: { $in: ids } },
      updateData,
      { runValidators: true }
    );

    res.status(200).json({
      message: "Waitlist entries updated successfully",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET WAITLIST STATISTICS
exports.getWaitlistStats = async (req, res) => {
  try {
    const stats = await Waitlist.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Waitlist.countDocuments();
    const pending = await Waitlist.countDocuments({ status: "pending" });
    const contacted = await Waitlist.countDocuments({ status: "contacted" });
    const enrolled = await Waitlist.countDocuments({ status: "enrolled" });

    // Recent entries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEntries = await Waitlist.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: {
          pending,
          contacted,
          enrolled,
          declined: total - pending - contacted - enrolled
        },
        recentEntries,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PENDING WAITLIST (priority sorted)
exports.getPendingWaitlist = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const entries = await Waitlist.find({ status: "pending" })
      .sort({ priority: -1, createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Waitlist.countDocuments({ status: "pending" });
    const meta = buildPaginationMeta(page, limit, total);

    res.status(200).json({
      success: true,
      data: entries,
      meta
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

