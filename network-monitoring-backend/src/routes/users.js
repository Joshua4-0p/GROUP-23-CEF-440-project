// src/routes/users.js
const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  deleteAccount,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, updateProfile);

// @route   POST /api/users/upload-picture
// @desc    Upload profile picture
// @access  Private
router.post("/upload-picture", auth, uploadProfilePicture);

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete("/account", auth, deleteAccount);

module.exports = router;
