// src/routes/dailyData.js
const express = require("express");
const router = express.Router();
const {
  createDailyData,
  getDailyData,
  getDailyDataStats,
} = require("../controllers/dailyDataController");
const auth = require("../middleware/auth");

// @route   POST /api/daily-data
// @desc    Create daily data entry
// @access  Private
router.post("/", auth, createDailyData);

// @route   GET /api/daily-data
// @desc    Get daily data
// @access  Private
router.get("/", auth, getDailyData);

// @route   GET /api/daily-data/stats
// @desc    Get daily data statistics
// @access  Private
router.get("/stats", auth, getDailyDataStats);

module.exports = router;
// This code defines the routes for daily data in a Node.js application using Express.
// It includes routes for creating daily data entries, retrieving daily data, and fetching daily data statistics