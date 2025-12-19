const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },

    parentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    programInterest: {
      type: String,
      default: "",
      trim: true
    },

    message: {
      type: String,
      default: "",
      trim: true
    },

    status: {
      type: String,
      enum: ["pending", "contacted", "enrolled", "declined"],
      default: "pending"
    },

    priority: {
      type: Number,
      default: 0, // Higher number = higher priority
      min: 0
    },

    notes: {
      type: String,
      default: "",
      trim: true
    },

    contactedAt: {
      type: Date,
      default: null
    },

    enrolledAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
waitlistSchema.index({ status: 1, createdAt: -1 });
waitlistSchema.index({ parentEmail: 1 });
waitlistSchema.index({ programInterest: 1 });

module.exports = mongoose.model("Waitlist", waitlistSchema);

