const express = require("express");
const { sendMessage, getMessages } = require("../controllers/contactController");

const router = express.Router();

// Send message (from the website contact form)
router.post("/", sendMessage);

// Admin get all messages
router.get("/", getMessages);

module.exports = router;
