// src/models/NetworkMetrics.js
const mongoose = require("mongoose");

const networkMetricsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    connectionType: {
      type: String,
      required: true,
      enum: ["wifi", "cellular", "ethernet", "unknown"],
    },
    isConnected: {
      type: Boolean,
      required: true,
    },
    isInternetReachable: {
      type: Boolean,
      default: null,
    },
    signalStrength: {
      type: Number,
      default: null,
      min: -150,
      max: 0,
    },
    downloadSpeed: {
      type: Number,
      required: true,
      min: 0,
    },
    downloadStatus: {
      type: String,
      enum: ["excellent", "good", "fair", "poor"],
      required: true,
    },
    uploadSpeed: {
      type: Number,
      required: true,
      min: 0,
    },
    uploadStatus: {
      type: String,
      enum: ["excellent", "good", "fair", "poor"],
      required: true,
    },
    latency: {
      type: Number,
      required: true,
      min: 0,
    },
    latencyStatus: {
      type: String,
      enum: ["excellent", "good", "fair", "poor"],
      required: true,
    },
    location: {
      latitude: {
        type: Number,
        default: null,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        default: null,
        min: -180,
        max: 180,
      },
      accuracy: {
        type: Number,
        default: null,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient querying
networkMetricsSchema.index({ userId: 1, timestamp: -1 });
networkMetricsSchema.index({ timestamp: -1 });
networkMetricsSchema.index({ "location.latitude": 1, "location.longitude": 1 });

module.exports = mongoose.model("NetworkMetrics", networkMetricsSchema);
// src/models/NetworkMetrics.js
// This model defines the structure for network metrics data, including user ID, device ID, connection type, connection status, signal strength, download/upload speeds, latency, and location data. It also includes timestamps for when the metrics were recorded. The schema is designed to support efficient querying with indexes on user ID and timestamp, as well as location coordinates.
// The model is exported for use in other parts of the application, allowing for the storage and retrieval of network metrics data associated with users and their devices.