// ===== SERVER.JS =====
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

// Import configuration and routes
const { envConfig } = require('./src/config/envConfig');
const dbConfig = require('./src/config/dbConfig');
const authRoutes = require('./src/routes/authRoutes');
const trackingRoutes = require('./src/routes/trackingRoutes');
const faceRoutes = require('./src/routes/faceRoutes');

const app = express();
const server = http.createServer(app);

// CORS configuration for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (for uploaded content)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/face', faceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});

// WebSocket connection handling
const activeUsers = new Map();
const activeSessions = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user authentication for socket
  socket.on('authenticate', (data) => {
    const { userId, sessionId } = data;
    activeUsers.set(socket.id, { userId, sessionId });
    socket.join(`session-${sessionId}`);
    console.log(`User ${userId} joined session ${sessionId}`);
  });

  // Handle real-time face detection data
  socket.on('face-metrics', async (data) => {
    try {
      const userInfo = activeUsers.get(socket.id);
      if (!userInfo) return;

      const metricsData = {
        sessionId: userInfo.sessionId,
        focusScore: data.focusScore || 0,
        postureScore: data.postureScore || 0,
        eyeStrainLevel: data.eyeStrainLevel || 0,
        distractionCount: data.distractionCount || 0,
        timestamp: new Date()
      };

      // Store metrics in database (you can implement this)
      // await trackingController.saveMetrics(metricsData);

      // Emit real-time updates to all clients in the session
      io.to(`session-${userInfo.sessionId}`).emit('metrics-update', metricsData);

      // Check for alerts
      const alerts = generateAlerts(metricsData);
      if (alerts.length > 0) {
        io.to(`session-${userInfo.sessionId}`).emit('session-alerts', alerts);
      }

    } catch (error) {
      console.error('Error processing face metrics:', error);
    }
  });

  // Handle session control events
  socket.on('session-control', (data) => {
    const userInfo = activeUsers.get(socket.id);
    if (!userInfo) return;

    io.to(`session-${userInfo.sessionId}`).emit('session-control-update', data);
  });

  // Handle break suggestions
  socket.on('request-break-suggestion', () => {
    const userInfo = activeUsers.get(socket.id);
    if (!userInfo) return;

    const suggestion = generateBreakSuggestion();
    socket.emit('break-suggestion', suggestion);
  });

  socket.on('disconnect', () => {
    const userInfo = activeUsers.get(socket.id);
    if (userInfo) {
      console.log(`User ${userInfo.userId} disconnected from session ${userInfo.sessionId}`);
      activeUsers.delete(socket.id);
    }
  });
});

// Helper functions
function generateAlerts(metrics) {
  const alerts = [];
  
  if (metrics.focusScore < 30) {
    alerts.push({
      type: 'focus',
      level: 'warning',
      message: 'Focus level is low. Consider taking a short break.',
      timestamp: new Date()
    });
  }
  
  if (metrics.postureScore < 40) {
    alerts.push({
      type: 'posture',
      level: 'warning',
      message: 'Poor posture detected. Adjust your sitting position.',
      timestamp: new Date()
    });
  }
  
  if (metrics.eyeStrainLevel > 70) {
    alerts.push({
      type: 'eye-strain',
      level: 'danger',
      message: 'High eye strain detected. Take a break and look away from screen.',
      timestamp: new Date()
    });
  }
  
  return alerts;
}

function generateBreakSuggestion() {
  const suggestions = [
    { 
      type: 'eye-rest',
      title: '20-20-20 Rule',
      description: 'Look at something 20 feet away for 20 seconds',
      duration: 20
    },
    {
      type: 'stretch',
      title: 'Neck and Shoulder Stretch',
      description: 'Gentle neck rolls and shoulder shrugs',
      duration: 60
    },
    {
      type: 'walk',
      title: 'Quick Walk',
      description: 'Take a 2-minute walk around your room',
      duration: 120
    },
    {
      type: 'hydrate',
      title: 'Hydration Break',
      description: 'Drink a glass of water and do some deep breathing',
      duration: 30
    }
  ];
  
  return suggestions[Math.floor(Math.random() * suggestions.length)];
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Internal Server Error',
      status: error.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404
    }
  });
});

// Start server
const PORT = process.env.PORT || 8000;

// Initialize database connection
dbConfig.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return dbConfig.sync({ alter: true }); // Use alter for development
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 TrackU Backend Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = { app, io };