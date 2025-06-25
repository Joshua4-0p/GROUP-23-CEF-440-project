// src/models/DailyData.js
const mongoose = require("mongoose");

const dailyDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    downloadSpeed: {
      type: Number,
      required: true,
      default: 0,
    },
    uploadSpeed: {
      type: Number,
      required: true,
      default: 0,
    },
    latency: {
      type: Number,
      required: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      accuracy: {
        type: Number,
        default: 500,
      },
    },
    timestamp: {
      type: Number,
      required: true,
    },
    avgSignalStrength: {
      type: Number,
      default: null,
    },
    connectionType: {
      type: String,
      default: "cellular",
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient daily queries
dailyDataSchema.index({ userId: 1, date: -1 });
dailyDataSchema.index({ timestamp: -1 });

module.exports = mongoose.model("DailyData", dailyDataSchema);
// This model represents daily network data for users, including download and upload speeds, latency, and location.
// It includes fields for user ID, date, speeds, latency, location coordinates, timestamp, average signal strength, and connection type.
// The schema is designed to support efficient querying with indexes on user ID and date, as well as timestamp.