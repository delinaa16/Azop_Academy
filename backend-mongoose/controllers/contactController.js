const Contact = require("../models/Contact");

// Save message from contact form
exports.sendMessage = async (req, res) => {
  try {
    const newMessage = new Contact(req.body);
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all messages (for admin)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
