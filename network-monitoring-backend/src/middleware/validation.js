// src/middleware/validation.js
const { body, validationResult } = require("express-validator");

// User registration validation
const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

// User login validation
const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Network metrics validation
const validateNetworkMetrics = [
  body("deviceId").notEmpty().withMessage("Device ID is required"),
  body("connectionType")
    .isIn(["wifi", "cellular", "ethernet", "unknown"])
    .withMessage("Invalid connection type"),
  body("isConnected").isBoolean().withMessage("isConnected must be a boolean"),
  body("downloadSpeed")
    .isFloat({ min: 0 })
    .withMessage("Download speed must be a positive number"),
  body("uploadSpeed")
    .isFloat({ min: 0 })
    .withMessage("Upload speed must be a positive number"),
  body("latency")
    .isInt({ min: 0 })
    .withMessage("Latency must be a positive integer"),
];

// Feedback validation
const validateFeedback = [
  body("experience")
    .isIn(["excellent", "good", "fair", "poor"])
    .withMessage("Invalid experience value"),
  body("areaOfFeedback")
    .isIn([
      "call_quality",
      "data_speed",
      "network_coverage",
      "customer_service",
      "billing",
      "other",
    ])
    .withMessage("Invalid area of feedback"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

// Check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateNetworkMetrics,
  validateFeedback,
  checkValidation,
};
// This module exports validation middlewares for user registration, login, network metrics, and feedback.
// It uses express-validator to define validation rules and check for errors.