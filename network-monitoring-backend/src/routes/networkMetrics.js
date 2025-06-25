// src/routes/networkMetrics.js
const express = require("express");
const router = express.Router();
const {
  createNetworkMetrics,
  getNetworkMetrics,
  getNetworkStats,
} = require("../controllers/networkMetricsController");
const {
  validateNetworkMetrics,
  checkValidation,
} = require("../middleware/validation");
const auth = require("../middleware/auth");

// @route   POST /api/network-metrics
// @desc    Create network metrics entry
// @access  Private
router.post(
  "/",
  auth,
  validateNetworkMetrics,
  checkValidation,
  createNetworkMetrics
);

// @route   GET /api/network-metrics
// @desc    Get user's network metrics
// @access  Private
router.get("/", auth, getNetworkMetrics);

// @route   GET /api/network-metrics/stats
// @desc    Get network statistics
// @access  Private
router.get("/stats", auth, getNetworkStats);

module.exports = router;
// This code defines the routes for network metrics in a Node.js application using Express.
// It includes routes for creating network metrics, retrieving user-specific network metrics, and fetching network statistics