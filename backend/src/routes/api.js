/ ===== src/routes/api.js =====
const express = require('express');
const authRoutes = require('./authRoutes');
const trackingRoutes = require('./trackingRoutes');
const faceRoutes = require('./faceRoutes');

const router = express.Router();

// API versioning
router.use('/v1/auth', authRoutes);
router.use('/v1/tracking', trackingRoutes);
router.use('/v1/face', faceRoutes);

// API info endpoint
router.get('/info', (req, res) => {
  res.json({
    name: 'TrackU Study Guardian API',
    version: '1.0.0',
    description: 'Real-time study monitoring and analytics API',
    endpoints: {
      auth: '/api/v1/auth',
      tracking: '/api/v1/tracking',
      face: '/api/v1/face'
    },
    docs: '/api/docs', // Future documentation endpoint
    health: '/api/health'
  });
});

module.exports = router;