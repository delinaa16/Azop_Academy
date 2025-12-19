const Teacher = require("../models/Teacher");
const Program = require("../models/Program");
const Gallery = require("../models/Gallery");
const Contact = require("../models/Contact");
const Waitlist = require("../models/Waitlist");

/**
 * Get comprehensive dashboard analytics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Basic counts
    const [
      totalTeachers,
      activeTeachers,
      totalPrograms,
      activePrograms,
      totalGalleryEntries,
      totalContacts,
      totalWaitlistEntries
    ] = await Promise.all([
      Teacher.countDocuments(),
      Teacher.countDocuments({ isActive: true }),
      Program.countDocuments(),
      Program.countDocuments({ isActive: true }),
      Gallery.countDocuments(),
      Contact.countDocuments(),
      Waitlist.countDocuments()
    ]);

    // Recent activity (last 30 days)
    const [
      recentContacts,
      recentWaitlist,
      recentTeachers,
      recentPrograms
    ] = await Promise.all([
      Contact.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Waitlist.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Teacher.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Program.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    ]);

    // Last 7 days activity
    const [
      contactsLast7Days,
      waitlistLast7Days
    ] = await Promise.all([
      Contact.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Waitlist.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    // Contact status breakdown
    const contactStatusBreakdown = await Contact.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Waitlist status breakdown
    const waitlistStatusBreakdown = await Waitlist.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Teachers by subject
    const teachersBySubject = await Teacher.aggregate([
      {
        $group: {
          _id: "$subject",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Gallery images count
    const galleryImagesCount = await Gallery.aggregate([
      {
        $project: {
          imageCount: { $size: "$images" }
        }
      },
      {
        $group: {
          _id: null,
          totalImages: { $sum: "$imageCount" }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          teachers: { total: totalTeachers, active: activeTeachers },
          programs: { total: totalPrograms, active: activePrograms },
          gallery: {
            entries: totalGalleryEntries,
            totalImages: galleryImagesCount[0]?.totalImages || 0
          },
          contacts: totalContacts,
          waitlist: totalWaitlistEntries
        },
        recentActivity: {
          last30Days: {
            contacts: recentContacts,
            waitlist: recentWaitlist,
            teachers: recentTeachers,
            programs: recentPrograms
          },
          last7Days: {
            contacts: contactsLast7Days,
            waitlist: waitlistLast7Days
          }
        },
        breakdowns: {
          contactStatus: contactStatusBreakdown,
          waitlistStatus: waitlistStatusBreakdown,
          teachersBySubject
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get activity trends over time
 */
exports.getActivityTrends = async (req, res) => {
  try {
    const days = parseInt(req.query.days || "30", 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Contacts trend
    const contactsTrend = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Waitlist trend
    const waitlistTrend = await Waitlist.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        contacts: contactsTrend,
        waitlist: waitlistTrend,
        period: { days, startDate, endDate: new Date() }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get program popularity analytics
 */
exports.getProgramAnalytics = async (req, res) => {
  try {
    // Programs with most waitlist interest
    const programInterest = await Waitlist.aggregate([
      {
        $match: {
          programInterest: { $ne: "" }
        }
      },
      {
        $group: {
          _id: "$programInterest",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        programInterest
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

