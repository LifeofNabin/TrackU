// ===== src/routes/faceRoutes.js =====
const express = require('express');
const { body, param, query } = require('express-validator');
const faceController = require('../controllers/faceController');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation rules
const processFrameValidation = [
  body('sessionId').isUUID().withMessage('Invalid session ID'),
  body('frameData').notEmpty().withMessage('Frame data is required'),
  body('timestamp').optional().isISO8601().withMessage('Invalid timestamp format')
];

const sessionIdValidation = [
  param('sessionId').isUUID().withMessage('Invalid session ID')
];

const calibrationValidation = [
  body('sessionId').isUUID().withMessage('Invalid session ID'),
  body('calibrationFrames').isArray({ min: 1 }).withMessage('Calibration frames array is required'),
  body('calibrationFrames.*.data').notEmpty().withMessage('Frame data is required for each calibration frame'),
  body('calibrationFrames.*.position').isString().withMessage('Position is required for each calibration frame')
];

const analyticsValidation = [
  param('sessionId').isUUID().withMessage('Invalid session ID'),
  query('timeRange').optional().matches(/^\d+[mhd]$/).withMessage('Time range must be in format: number + m/h/d (e.g., 30m, 2h, 1d)')
];

// Face detection routes
router.post('/process-frame', processFrameValidation, faceController.processFrame);
router.get('/detection-status/:sessionId', sessionIdValidation, faceController.getDetectionStatus);
router.post('/calibrate', calibrationValidation, faceController.calibrateFaceDetection);
router.get('/analytics/:sessionId', analyticsValidation, faceController.getFaceAnalytics);

module.exports = router;