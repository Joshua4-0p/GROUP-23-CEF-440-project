// src/controllers/networkMetricsController.js
const NetworkMetrics = require("../models/NetworkMetrics");

// Helper function to determine status based on values
const getSpeedStatus = (speed) => {
  if (speed >= 25) return "excellent";
  if (speed >= 10) return "good";
  if (speed >= 1) return "fair";
  return "poor";
};

const getLatencyStatus = (latency) => {
  if (latency <= 50) return "excellent";
  if (latency <= 100) return "good";
  if (latency <= 300) return "fair";
  return "poor";
};

// Create network metrics entry
const createNetworkMetrics = async (req, res) => {
  try {
    const {
      deviceId,
      timestamp,
      connectionType,
      isConnected,
      isInternetReachable,
      signalStrength,
      downloadSpeed,
      uploadSpeed,
      latency,
      location,
    } = req.body;

    // Auto-determine status based on values
    const downloadStatus = getSpeedStatus(downloadSpeed);
    const uploadStatus = getSpeedStatus(uploadSpeed);
    const latencyStatus = getLatencyStatus(latency);

    const networkMetrics = new NetworkMetrics({
      userId: req.user._id,
      deviceId,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      connectionType,
      isConnected,
      isInternetReachable,
      signalStrength,
      downloadSpeed,
      downloadStatus,
      uploadSpeed,
      uploadStatus,
      latency,
      latencyStatus,
      location,
    });

    await networkMetrics.save();

    res.status(201).json({
      success: true,
      message: "Network metrics saved successfully",
      data: networkMetrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving network metrics",
      error: error.message,
    });
  }
};

// Get user's network metrics
const getNetworkMetrics = async (req, res) => {
  try {
    const { page = 1, limit = 50, startDate, endDate } = req.query;

    // Build query
    const query = { userId: req.user._id };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const metrics = await NetworkMetrics.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await NetworkMetrics.countDocuments(query);

    res.json({
      success: true,
      data: {
        metrics,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching network metrics",
      error: error.message,
    });
  }
};

// Get aggregated network statistics
const getNetworkStats = async (req, res) => {
  try {
    const { period = "7d" } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;

    switch (period) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const stats = await NetworkMetrics.aggregate([
      {
        $match: {
          userId: req.user._id,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          avgDownloadSpeed: { $avg: "$downloadSpeed" },
          avgUploadSpeed: { $avg: "$uploadSpeed" },
          avgLatency: { $avg: "$latency" },
          avgSignalStrength: { $avg: "$signalStrength" },
          totalRecords: { $sum: 1 },
          connectionTypes: { $addToSet: "$connectionType" },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        avgDownloadSpeed: 0,
        avgUploadSpeed: 0,
        avgLatency: 0,
        avgSignalStrength: 0,
        totalRecords: 0,
        connectionTypes: [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching network statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createNetworkMetrics,
  getNetworkMetrics,
  getNetworkStats,
};
// This controller handles network metrics operations such as creating metrics,
// fetching user metrics, and aggregating network statistics.