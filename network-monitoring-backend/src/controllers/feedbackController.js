// src/controllers/feedbackController.js
const Feedback = require("../models/Feedback");

// Create feedback
const createFeedback = async (req, res) => {
  try {
    const {
      experience,
      areaOfFeedback,
      description,
      rating,
      location,
      networkProvider,
    } = req.body;

    const feedback = new Feedback({
      userId: req.user._id,
      experience,
      areaOfFeedback,
      description,
      rating,
      location,
      networkProvider: networkProvider || req.user.preferences.network,
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting feedback",
      error: error.message,
    });
  }
};

// Get user's feedback
const getFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 20, area, experience } = req.query;

    // Build query
    const query = { userId: req.user._id };

    if (area) query.areaOfFeedback = area;
    if (experience) query.experience = experience;

    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      data: {
        feedback,
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
      message: "Error fetching feedback",
      error: error.message,
    });
  }
};

// Get feedback statistics
const getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: "$areaOfFeedback",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          experiences: { $push: "$experience" },
        },
      },
    ]);

    const overallStats = await Feedback.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          experienceDistribution: {
            $push: "$experience",
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        byArea: stats,
        overall: overallStats[0] || {
          totalFeedback: 0,
          avgRating: 0,
          experienceDistribution: [],
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching feedback statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getFeedback,
  getFeedbackStats,
};
// This controller handles user feedback submissions, retrieval, and statistics.
// It allows users to submit feedback, view their feedback history, and get statistics on their feedback