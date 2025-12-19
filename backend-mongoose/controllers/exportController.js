const Teacher = require("../models/Teacher");
const Program = require("../models/Program");
const Contact = require("../models/Contact");
const Waitlist = require("../models/Waitlist");
const Gallery = require("../models/Gallery");

/**
 * Convert array of objects to CSV string
 */
function arrayToCSV(data, headers) {
  if (!data || data.length === 0) return "";

  const csvHeaders = headers || Object.keys(data[0]);
  const csvRows = [csvHeaders.join(",")];

  data.forEach((row) => {
    const values = csvHeaders.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) return "";
      // Escape commas and quotes in CSV
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    });
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
}

/**
 * Export Teachers to CSV
 */
exports.exportTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ order: 1, createdAt: -1 });
    const csv = arrayToCSV(teachers, ["name", "subject", "experience", "bio", "isActive", "order", "createdAt"]);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=teachers-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Export Programs to CSV
 */
exports.exportPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ order: 1, createdAt: -1 });
    const csv = arrayToCSV(programs, ["title", "description", "duration", "isActive", "order", "createdAt"]);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=programs-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Export Contacts to CSV
 */
exports.exportContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    const csv = arrayToCSV(contacts, [
      "name",
      "email",
      "phone",
      "subject",
      "message",
      "status",
      "isArchived",
      "createdAt"
    ]);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=contacts-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Export Waitlist to CSV
 */
exports.exportWaitlist = async (req, res) => {
  try {
    const waitlist = await Waitlist.find().sort({ priority: -1, createdAt: 1 });
    const csv = arrayToCSV(waitlist, [
      "studentName",
      "parentEmail",
      "phone",
      "programInterest",
      "message",
      "status",
      "priority",
      "notes",
      "createdAt",
      "contactedAt",
      "enrolledAt"
    ]);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=waitlist-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Export data as JSON
 */
exports.exportJSON = async (req, res) => {
  try {
    const { type } = req.params;
    let data;

    switch (type) {
      case "teachers":
        data = await Teacher.find().sort({ order: 1, createdAt: -1 });
        break;
      case "programs":
        data = await Program.find().sort({ order: 1, createdAt: -1 });
        break;
      case "contacts":
        data = await Contact.find().sort({ createdAt: -1 });
        break;
      case "waitlist":
        data = await Waitlist.find().sort({ priority: -1, createdAt: 1 });
        break;
      case "gallery":
        data = await Gallery.find().sort({ createdAt: -1 });
        break;
      default:
        return res.status(400).json({ message: "Invalid export type" });
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${type}-${Date.now()}.json`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

