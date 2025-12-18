const express = require("express");
const auth = require("../middleware/auth");
const {
  sendMessage,
  getMessages,
  getMessageById,
  deleteMessage,
  deleteAllMessages,
  markAsRead,
  getUnreadMessages,
  archiveMessage,
} = require("../controllers/contactController");
const { body } = require("express-validator"); // import validator

const router = express.Router();

// Send message (from the website contact form) with validation
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("message").notEmpty().withMessage("Message cannot be empty")
  ],
  sendMessage
);

// Admin: get all messages
router.get("/", auth, getMessages);

// Admin: get unread messages
router.get("/unread", auth, getUnreadMessages);

// Admin: get one message
router.get("/:id", auth, getMessageById);

// Admin: mark as read
router.patch("/:id/read", auth, markAsRead);

// Admin: archive
router.patch("/:id/archive", auth, archiveMessage);

// Admin: delete one
router.delete("/:id", auth, deleteMessage);

// Admin: delete all
router.delete("/", auth, deleteAllMessages);

module.exports = router;
