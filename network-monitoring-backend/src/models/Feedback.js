// src/models/Feedback.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experience: {
      type: String,
      required: true,
      enum: ["excellent", "good", "fair", "poor"],
    },
    areaOfFeedback: {
      type: String,
      required: true,
      enum: [
        "call_quality",
        "data_speed",
        "network_coverage",
        "customer_service",
        "billing",
        "other",
      ],
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    location: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
    networkProvider: {
      type: String,
      enum: ["MTN", "Orange", "Camtel"],
      default: null,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ areaOfFeedback: 1 });
feedbackSchema.index({ experience: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
// This schema defines the structure for user feedback in the network monitoring application.
// It includes fields for user ID, experience rating, area of feedback, description, numerical rating, location coordinates, network provider, and a resolution status.
// The schema also includes timestamps for when the feedback was created and last updated.