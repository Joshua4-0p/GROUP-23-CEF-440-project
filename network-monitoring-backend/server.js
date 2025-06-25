// server.js
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/utils/database");

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Create uploads directory if it doesn't exist
const fs = require("fs");
const uploadDir = process.env.UPLOAD_PATH || "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
// Handle SIGINT (Ctrl+C)