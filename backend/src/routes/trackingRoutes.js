// ===== src/routes/trackingRoutes.js =====
const express = require('express');
const { body, param, query } = require('express-validator');
const trackingController = require('../controllers/trackingController');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation rules
const createSessionValidation = [
  body('subject').trim().isLength({ min: 1, max: 100 }).withMessage('Subject is required (1-100 characters)'),
  body('targetDuration').isInt({ min: 1, max: 480 }).withMessage('Target duration must be 1-480 minutes'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  body('goal').optional().trim().isLength({ max: 500 }).withMessage('Goal must be max 500 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('environment').optional().isObject().withMessage('Environment must be an object')
];

const sessionIdValidation = [
  param('sessionId').isUUID().withMessage('Invalid session ID')
];

const metricsValidation = [
  param('sessionId').isUUID().withMessage('Invalid session ID'),
  body('focusScore').optional().isFloat({ min: 0, max: 100 }).withMessage('Focus score must be 0-100'),
  body('postureScore').optional().isFloat({ min: 0, max: 100 }).withMessage('Posture score must be 0-100'),
  body('eyeStrainLevel').optional().isFloat({ min: 0, max: 100 }).withMessage('Eye strain level must be 0-100'),
  body('distractionCount').optional().isInt({ min: 0 }).withMessage('Distraction count must be non-negative'),
  body('faceDetected').optional().isBoolean().withMessage('Face detected must be boolean'),
  body('alerts').optional().isArray().withMessage('Alerts must be an array')
];

const addBreakValidation = [
  param('sessionId').isUUID().withMessage('Invalid session ID'),
  body('duration').optional().isInt({ min: 1, max: 60 }).withMessage('Break duration must be 1-60 minutes'),
  body('type').optional().isString().withMessage('Break type must be a string'),
  body('reason').optional().isString().withMessage('Break reason must be a string')
];

const endSessionValidation = [
  param('sessionId').isUUID().withMessage('Invalid session ID'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes must be max 1000 characters')
];

const getUserSessionsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('status').optional().isIn(['planned', 'active', 'paused', 'completed', 'cancelled']).withMessage('Invalid status'),
  query('subject').optional().isString().withMessage('Subject must be string')
];

const dashboardAnalyticsValidation = [
  query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be 1-365')
];

// Session management routes
router.post('/sessions', createSessionValidation, trackingController.createSession);
router.get('/sessions', getUserSessionsValidation, trackingController.getUserSessions);
router.get('/sessions/:sessionId', sessionIdValidation, trackingController.getSessionDetails);

// Session control routes
router.put('/sessions/:sessionId/start', sessionIdValidation, trackingController.startSession);
router.put('/sessions/:sessionId/pause', sessionIdValidation, trackingController.pauseSession);
router.put('/sessions/:sessionId/resume', sessionIdValidation, trackingController.resumeSession);
router.put('/sessions/:sessionId/end', endSessionValidation, trackingController.endSession);

// Break management
router.post('/sessions/:sessionId/breaks', addBreakValidation, trackingController.addBreak);

// Metrics tracking
router.put('/sessions/:sessionId/metrics', metricsValidation, trackingController.saveMetrics);

// Analytics
router.get('/analytics/dashboard', dashboardAnalyticsValidation, trackingController.getDashboardAnalytics);

module.exports = router;