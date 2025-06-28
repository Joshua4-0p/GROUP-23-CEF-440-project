// src/routes/dailyData.js
const express = require("express");
const router = express.Router();
const {
  createDailyData,
  getDailyData,
  getDailyDataStats,
} = require("../controllers/dailyDataController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Daily Data
 *   description: Daily data management
 */

/**
 * @swagger
 * /daily-data:
 *   post:
 *     summary: Create daily data entry
 *     tags: [Daily Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DailyData'
 *     responses:
 *       201:
 *         description: Daily data created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, createDailyData);

/**
 * @swagger
 * /daily-data:
 *   get:
 *     summary: Get daily data
 *     tags: [Daily Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of daily data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DailyData'
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, getDailyData);

/**
 * @swagger
 * /daily-data/stats:
 *   get:
 *     summary: Get daily data statistics
 *     tags: [Daily Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily data statistics
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", auth, getDailyDataStats);

module.exports = router;
// This code defines the routes for daily data in a Node.js application using Express.
// It includes routes for creating daily data entries, retrieving daily data, and fetching daily data statistics