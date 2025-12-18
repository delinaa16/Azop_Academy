const { validationResult } = require("express-validator");
const Contact = require("../models/Contact");

// ======================= CONTACT CONTROLLER =======================

// Send message (with validation)
exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newMessage = new Contact(req.body);
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", data: newMessage });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all messages (newest first)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete single message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete all messages
exports.deleteAllMessages = async (req, res) => {
  try {
    await Contact.deleteMany({});
    res.json({ message: "All messages deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark a message as read (schema uses status field)
exports.markAsRead = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message marked as read", data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Archive a message
exports.archiveMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message archived", data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get only unread ("new") messages
exports.getUnreadMessages = async (req, res) => {
  try {
    const messages = await Contact.find({ status: "new", isArchived: false }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
