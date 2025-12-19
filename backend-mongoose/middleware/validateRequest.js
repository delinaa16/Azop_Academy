const { validationResult } = require("express-validator");

/**
 * Middleware to validate request using express-validator
 * Should be used after validation rules
 */
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()
    });
  }
  next();
};

/**
 * Sanitize MongoDB ObjectId
 */
exports.validateObjectId = (req, res, next) => {
  const mongoose = require("mongoose");
  const { id } = req.params;

  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format"
    });
  }
  next();
};

/**
 * Validate pagination parameters
 */
exports.validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  if (page && (isNaN(page) || page < 1)) {
    return res.status(400).json({
      success: false,
      message: "Page must be a positive integer"
    });
  }

  if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    return res.status(400).json({
      success: false,
      message: "Limit must be between 1 and 100"
    });
  }

  next();
};

