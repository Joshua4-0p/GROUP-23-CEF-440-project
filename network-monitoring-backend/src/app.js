// src/app.js
// src/app.js - Clean version without debug code
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// STEP 2: Comment out ALL route imports initially
// We'll add them back one by one to find the problem

console.log('Starting route loading process...');

// Try loading routes one by one
try {
  console.log('Loading auth routes...');
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
  // Don't exit - continue to test other routes
}

try {
  console.log('Loading user routes...');
  const userRoutes = require('./routes/users');
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading user routes:', error.message);
}

try {
  console.log('Loading network metrics routes...');
  const networkMetricsRoutes = require('./routes/networkMetrics');
  app.use('/api/network-metrics', networkMetricsRoutes);
  console.log('✅ Network metrics routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading network metrics routes:', error.message);
}

try {
  console.log('Loading feedback routes...');
  const feedbackRoutes = require('./routes/feedback');
  app.use('/api/feedback', feedbackRoutes);
  console.log('✅ Feedback routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading feedback routes:', error.message);
}

try {
  console.log('Loading daily data routes...');
  const dailyDataRoutes = require('./routes/dailyData');
  app.use('/api/daily-data', dailyDataRoutes);
  console.log('✅ Daily data routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading daily data routes:', error.message);
}

console.log('Route loading process completed');

// Import error handling middleware
const errorHandler = require('./middleware/errorHandler');

// Catch 404 and forward to error handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
// This code sets up an Express application with various middleware for security, CORS, rate limiting, and logging.
// It defines routes for authentication, user management, network metrics, feedback, and daily data.