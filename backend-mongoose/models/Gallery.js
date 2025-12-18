const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    images: {
      type: [String],          // array of image filenames or URLs
      required: true,
      validate: {
        validator: v => v.length > 0,
        message: "At least one image is required"
      }
    },

    title: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      default: "general"
    },

    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Gallery", gallerySchema);
