// src/app.js
// src/app.js - Clean version without debug code
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Create Express app
const app = express();

// Swagger Configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Network Monitoring API',
    version: '1.0.0',
    description: 'API for monitoring network performance, managing users, and collecting feedback.',
    contact: {
      name: 'API Support',
      email: 'support@joshuaboma.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server'
    },
    {
      url: 'your-deployed-url/api',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    },
    schemas: {
      UserRegistration: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          password: { type: 'string', example: 'PPPPassword123' },
          deviceId: { type: 'string', example: 'device-xyz' },
          preferences: {
            type: 'object',
            properties: {
              network: { type: 'string', enum: ['MTN', 'Orange', 'Camtel'], example: 'MTN' },
              anonymize: { type: 'boolean', example: false },
              dataSharing: { type: 'boolean', example: true }
            }
          }
        }
      },
      UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'john@example.com' },
          password: { type: 'string', example: 'Password123' }
        }
      },
      NetworkMetrics: {
        type: 'object',
        required: [
          'deviceId', 'timestamp', 'connectionType', 'isConnected', 'downloadSpeed', 'downloadStatus', 'uploadSpeed', 'uploadStatus', 'latency', 'latencyStatus'
        ],
        properties: {
          deviceId: { type: 'string', example: 'device-xyz' },
          timestamp: { type: 'string', format: 'date-time', example: '2024-06-26T12:00:00Z' },
          connectionType: { type: 'string', enum: ['wifi', 'cellular', 'ethernet', 'unknown'], example: 'wifi' },
          isConnected: { type: 'boolean', example: true },
          isInternetReachable: { type: 'boolean', example: true },
          signalStrength: { type: 'number', example: -70 },
          downloadSpeed: { type: 'number', example: 25.5 },
          downloadStatus: { type: 'string', enum: ['excellent', 'good', 'fair', 'poor'], example: 'good' },
          uploadSpeed: { type: 'number', example: 10.2 },
          uploadStatus: { type: 'string', enum: ['excellent', 'good', 'fair', 'poor'], example: 'good' },
          latency: { type: 'number', example: 50 },
          latencyStatus: { type: 'string', enum: ['excellent', 'good', 'fair', 'poor'], example: 'good' },
          location: {
            type: 'object',
            properties: {
              latitude: { type: 'number', example: 4.0511 },
              longitude: { type: 'number', example: 9.7679 },
              accuracy: { type: 'number', example: 10 }
            }
          }
        }
      },
      Feedback: {
        type: 'object',
        required: ['experience', 'areaOfFeedback', 'description', 'rating'],
        properties: {
          experience: { type: 'string', enum: ['excellent', 'good', 'fair', 'poor'], example: 'good' },
          areaOfFeedback: {
            type: 'string',
            enum: ['call_quality', 'data_speed', 'network_coverage', 'customer_service', 'billing', 'other'],
            example: 'data_speed'
          },
          description: { type: 'string', example: 'Internet speed is slow in my area.' },
          rating: { type: 'number', minimum: 1, maximum: 5, example: 3 },
          location: {
            type: 'object',
            properties: {
              latitude: { type: 'number', example: 4.0511 },
              longitude: { type: 'number', example: 9.7679 }
            }
          },
          networkProvider: { type: 'string', enum: ['MTN', 'Orange', 'Camtel'], example: 'MTN' },
          resolved: { type: 'boolean', example: false }
        }
      },
      DailyData: {
        type: 'object',
        required: [
          'date', 'downloadSpeed', 'uploadSpeed', 'latency', 'location', 'timestamp'
        ],
        properties: {
          date: { type: 'string', format: 'date', example: '2024-06-26' },
          downloadSpeed: { type: 'number', example: 20.5 },
          uploadSpeed: { type: 'number', example: 8.3 },
          latency: { type: 'number', example: 60 },
          location: {
            type: 'object',
            required: ['latitude', 'longitude'],
            properties: {
              latitude: { type: 'number', example: 4.0511 },
              longitude: { type: 'number', example: 9.7679 },
              accuracy: { type: 'number', example: 10 }
            }
          },
          timestamp: { type: 'number', example: 1719408000 },
          avgSignalStrength: { type: 'number', example: -65 },
          connectionType: { type: 'string', example: 'cellular' }
        }
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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