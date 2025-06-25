// src/middleware/security.js
const rateLimit = require("express-rate-limit");

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for data submission endpoints
const dataLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    success: false,
    message: "Too many data submissions, please slow down.",
  },
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any potential script tags or HTML
  const sanitize = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].replace(
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          ""
        );
        obj[key] = obj[key].replace(/<[^>]*>/g, "");
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

module.exports = {
  authLimiter,
  dataLimiter,
  sanitizeInput,
};
// This middleware file provides security features for the application, including rate limiting and input sanitization.
// The `authLimiter` restricts the number of authentication attempts to prevent brute force attacks.