// src/routes/networkMetrics.js
const express = require("express");
const router = express.Router();
const {
  createNetworkMetrics,
  getNetworkMetrics,
  getNetworkStats,
} = require("../controllers/networkMetricsController");
const {
  validateNetworkMetrics,
  checkValidation,
} = require("../middleware/validation");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Network Metrics
 *   description: Network metrics management
 */

/**
 * @swagger
 * /network-metrics:
 *   post:
 *     summary: Create network metrics entry
 *     tags: [Network Metrics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NetworkMetrics'
 *     responses:
 *       201:
 *         description: Network metrics created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  auth,
  validateNetworkMetrics,
  checkValidation,
  createNetworkMetrics
);

/**
 * @swagger
 * /network-metrics:
 *   get:
 *     summary: Get user's network metrics
 *     tags: [Network Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of network metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NetworkMetrics'
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, getNetworkMetrics);

/**
 * @swagger
 * /network-metrics/stats:
 *   get:
 *     summary: Get network statistics
 *     tags: [Network Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Network statistics
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", auth, getNetworkStats);

module.exports = router;
// This code defines the routes for network metrics in a Node.js application using Express.
// It includes routes for creating network metrics, retrieving user-specific network metrics, and fetching network statistics