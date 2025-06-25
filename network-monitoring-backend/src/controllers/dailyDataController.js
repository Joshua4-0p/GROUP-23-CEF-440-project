// src/controllers/dailyDataController.js (continued)
const DailyData = require("../models/DailyData"); // Import the DailyData model

// Create daily data entry
const createDailyData = async (req, res) => {
  try {
    const {
      date,
      downloadSpeed,
      uploadSpeed,
      latency,
      location, // Expected to be an object { latitude, longitude, accuracy }
      timestamp, // Expected to be a number (Unix timestamp)
      avgSignalStrength,
      connectionType,
    } = req.body;

    // Basic validation for required fields
    // More comprehensive validation is handled by express-validator middleware (validateDailyData)
    if (
      !date ||
      downloadSpeed === undefined ||
      uploadSpeed === undefined ||
      latency === undefined ||
      !location ||
      timestamp === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields for daily data entry. Ensure date, downloadSpeed, uploadSpeed, latency, location, and timestamp are provided.",
      });
    }

    // Create a new DailyData document
    const dailyData = new DailyData({
      userId: req.user._id, // userId should be set by the auth middleware
      date: new Date(date), // Convert date string to Date object
      downloadSpeed,
      uploadSpeed,
      latency,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || 500, // Use default if not provided
      },
      timestamp, // Use as is, as it's defined as a Number in schema
      avgSignalStrength,
      connectionType,
    });

    // Save the new document to the database
    await dailyData.save();

    res.status(201).json({
      success: true,
      message: "Daily data entry created successfully",
      data: dailyData,
    });
  } catch (error) {
    // Handle Mongoose validation errors (e.g., if a field type is wrong)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed for daily data entry",
        errors: messages,
      });
    }

    // Handle other potential server errors
    console.error("Error in createDailyData:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating daily data entry",
      error: error.message,
    });
  }
};

// Get user's daily data
const getDailyData = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0); // Set to start of the day

    const dailyData = await DailyData.find({
      userId: req.user._id,
      date: { $gte: startDate },
    }).sort({ date: -1 }); // Sort by date descending

    res.json({
      success: true,
      data: dailyData,
    });
  } catch (error) {
    console.error("Error in getDailyData:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching daily data",
      error: error.message,
    });
  }
};

// Get aggregated daily data statistics
const getDailyDataStats = async (req, res) => {
  try {
    const { period = "30d" } = req.query;

    // Parse the period to get number of days
    const days = parseInt(period.replace("d", ""));
    if (isNaN(days) || days <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid 'period' parameter. Use formats like '7d', '30d'.",
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0); // Set to start of the day

    const stats = await DailyData.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            // Group by year, month, and day to get daily aggregates
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          avgDownloadSpeed: { $avg: "$downloadSpeed" },
          avgUploadSpeed: { $avg: "$uploadSpeed" },
          avgLatency: { $avg: "$latency" },
          avgSignalStrength: { $avg: "$avgSignalStrength" },
          count: { $sum: 1 }, // Count of entries for that day
        },
      },
      {
        $sort: {
          // Sort results by date descending
          "_id.year": -1,
          "_id.month": -1,
          "_id.day": -1,
        },
      },
    ]);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error in getDailyDataStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching daily data statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createDailyData,
  getDailyData,
  getDailyDataStats,
};

// This controller handles daily data operations such as creating, fetching, and aggregating daily network metrics.