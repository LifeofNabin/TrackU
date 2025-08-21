const faceRecognitionService = require('../services/faceRecognitionService');
const activityAnalysisService = require('../services/activityAnalysisService');
const { Activity, Session } = require('../models');
const { validationResult } = require('express-validator');

class FaceController {
  // Process face detection frame
  async processFrame(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { sessionId, frameData, timestamp } = req.body;

      // Verify session ownership
      const session = await Session.findOne({
        where: { id: sessionId, userId: req.userId }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Process frame data
      const faceData = await faceRecognitionService.analyzeFrame(frameData);
      
      // Generate metrics and alerts
      const analysis = activityAnalysisService.analyzeActivity(faceData, session);

      // Save activity data
      const activity = await Activity.create({
        sessionId,
        userId: req.userId,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        metrics: analysis.metrics,
        alerts: analysis.alerts,
        rawData: faceData
      });

      res.json({
        success: true,
        data: {
          metrics: analysis.metrics,
          alerts: analysis.alerts,
          recommendations: analysis.recommendations,
          activityId: activity.id
        }
      });

    } catch (error) {
      console.error('Process frame error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get face detection status
  async getDetectionStatus(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await Session.findOne({
        where: { id: sessionId, userId: req.userId }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Get last 10 activities to determine status
      const recentActivities = await Activity.findAll({
        where: { sessionId },
        limit: 10,
        order: [['timestamp', 'DESC']]
      });

      const status = faceRecognitionService.getDetectionStatus(recentActivities);

      res.json({
        success: true,
        data: { status }
      });

    } catch (error) {
      console.error('Get detection status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Calibrate face detection
  async calibrateFaceDetection(req, res) {
    try {
      const { sessionId, calibrationFrames } = req.body;

      const session = await Session.findOne({
        where: { id: sessionId, userId: req.userId }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      const calibrationResult = await faceRecognitionService.calibrate(calibrationFrames);

      res.json({
        success: true,
        message: 'Face detection calibrated successfully',
        data: { calibrationResult }
      });

    } catch (error) {
      console.error('Calibrate face detection error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get face detection analytics
  async getFaceAnalytics(req, res) {
    try {
      const { sessionId } = req.params;
      const { timeRange = '1h' } = req.query;

      const session = await Session.findOne({
        where: { id: sessionId, userId: req.userId }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      const analytics = await faceRecognitionService.getAnalytics(sessionId, timeRange);

      res.json({
        success: true,
        data: { analytics }
      });

    } catch (error) {
      console.error('Get face analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new FaceController();