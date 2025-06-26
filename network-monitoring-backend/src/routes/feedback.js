// src/routes/feedback.js
const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getFeedback,
  getFeedbackStats,
} = require("../controllers/feedbackController");
const {
  validateFeedback,
  checkValidation,
} = require("../middleware/validation");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Feedback management
 */

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Create feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, validateFeedback, checkValidation, createFeedback);

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Get user's feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, getFeedback);

/**
 * @swagger
 * /feedback/stats:
 *   get:
 *     summary: Get feedback statistics
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feedback statistics
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", auth, getFeedbackStats);

module.exports = router;
// This code defines the routes for feedback in a Node.js application using Express.
// It includes routes for creating feedback, retrieving user-specific feedback, and fetching feedback statistics.