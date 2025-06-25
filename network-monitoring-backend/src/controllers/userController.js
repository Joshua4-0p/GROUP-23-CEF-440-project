// src/controllers/userController.js
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_PATH || "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Get user profile
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, preferences } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (preferences)
      updates.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const pictureUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { picture: pictureUrl },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile picture uploaded successfully",
      data: {
        user,
        pictureUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading profile picture",
      error: error.message,
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    res.json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deactivating account",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture: [upload.single("picture"), uploadProfilePicture],
  deleteAccount,
};
// This code provides user profile management functionalities including getting the profile, updating it, uploading a profile picture, and deleting the account.
// It uses multer for file uploads and handles errors appropriately. The profile picture is stored in a specified upload path, and the user model is updated with the new picture URL.
// The code also includes error handling for various operations, ensuring that appropriate responses are sent back to the client in case of success or failure.
// The uploadProfilePicture function uses multer to handle file uploads, ensuring that only image files are accepted and that the file size does not exceed a specified limit.
// The profile picture is saved with a unique filename to avoid conflicts, and the user's profile is updated with the new picture URL.