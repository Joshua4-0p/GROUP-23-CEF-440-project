// src/utils/helpers.js
const crypto = require("crypto");

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

// Calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in kilometers
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Format date for consistent API responses
const formatDate = (date) => {
  return new Date(date).toISOString();
};

// Validate coordinates
const isValidCoordinate = (lat, lon) => {
  return (
    typeof lat === "number" &&
    typeof lon === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
};

// Clean object by removing null/undefined values
const cleanObject = (obj) => {
  const cleaned = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
};

module.exports = {
  generateRandomString,
  calculateDistance,
  formatDate,
  isValidCoordinate,
  cleanObject,
};
// This module provides utility functions for generating random strings, calculating distances between coordinates,
// formatting dates, validating coordinates, and cleaning objects by removing null or undefined values.