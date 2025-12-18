const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,              // removes extra spaces
      minlength: 2
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },

    phone: {
      type: String,
      default: "",
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5
    },

    subject: {
      type: String,
      default: "General Inquiry"
    },

    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new"
    },

    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Contacts", contactSchema);
