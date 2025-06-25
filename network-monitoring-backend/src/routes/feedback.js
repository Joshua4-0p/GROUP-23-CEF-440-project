// src/routes/feedback.js
const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getFeedback,
  getFeedbackStats,
} = require("../controllers/feedbackController");
const {
  validateFeedback,
  checkValidation,
} = require("../middleware/validation");
const auth = require("../middleware/auth");

// @route   POST /api/feedback
// @desc    Create feedback
// @access  Private
router.post("/", auth, validateFeedback, checkValidation, createFeedback);

// @route   GET /api/feedback
// @desc    Get user's feedback
// @access  Private
router.get("/", auth, getFeedback);

// @route   GET /api/feedback/stats
// @desc    Get feedback statistics
// @access  Private
router.get("/stats", auth, getFeedbackStats);

module.exports = router;
// This code defines the routes for feedback in a Node.js application using Express.
// It includes routes for creating feedback, retrieving user-specific feedback, and fetching feedback statistics.