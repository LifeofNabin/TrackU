const { Session, Activity, User } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class TrackingController {
  // Create new study session
  async createSession(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { subject, targetDuration, difficulty, goal, tags, environment } = req.body;

      const session = await Session.create({
        userId: req.userId,
        subject,
        targetDuration,
        difficulty: difficulty || 'medium',
        goal,
        tags: tags || [],
        environment: environment || {}
      });

      res.status(201).json({
        success: true,
        message: 'Study session created successfully',
        data: { session }
      });

    } catch (error) {
      console.error('Create session error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Start session
  async startSession(req, res) {
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

      if (session.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'Session is already active'
        });
      }

      await session.start();

      res.json({
        success: true,
        message: 'Session started successfully',
        data: { session }
      });

    } catch (error) {
      console.error('Start session error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Pause session
  async pauseSession(req, res) {
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

      await session.pause();

      res.json({
        success: true,
        message: 'Session paused successfully',
        data: { session }
      });

    } catch (error) {
      console.error('Pause session error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Resume session
  async resumeSession(req, res) {
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

      await session.resume();

      res.json({
        success: true,
        message: 'Session resumed successfully',
        data: { session }
      });

    } catch (error) {
      console.error('Resume session error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // End session
  async endSession(req, res) {
    try {
      const { sessionId } = req.params;
      const { notes } = req.body;

      const session = await Session.findOne({
        where: { id: sessionId, userId: req.userId },
        include: [{ model: Activity, as: 'activities' }]
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Calculate final metrics from activities
      if (session.activities && session.activities.length > 0) {
        const analytics = await Activity.getSessionAnalytics(sessionId);
        if (analytics) {
          session.averageMetrics = analytics.averageMetrics;
          session.totalAlerts = analytics.totalAlerts;
        }
      }

      if (notes) {
        session.notes = notes;
      }

      await session.complete();

      // Update user stats
      const user = await User.findByPk(req.userId);
      if (user) {
        await user.updateStats({
          duration: session.actualDuration,
          averageFocusScore: session.averageMetrics.focusScore,
          averagePostureScore: session.averageMetrics.postureScore
        });
      }

      res.json({
        success: true,
        message: 'Session completed successfully',
        data: { session }
      });

    } catch (error) {
      console.error('End session error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Add break to session
  async addBreak(req, res) {
    try {
      const { sessionId } = req.params;
      const { duration, type, reason } = req.body;

      const session = await Session.findOne({
        where: { id: sessionId, userId: req.userId }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      await session.addBreak({ duration, type, reason });

      res.json({
        success: true,
        message: 'Break added successfully',
        data: { session }
      });

    } catch (error) {
      console.error('Add break error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Save real-time metrics
  async saveMetrics(req, res) {
    try {
      const { sessionId } = req.params;
      const { focusScore, postureScore, eyeStrainLevel, distractionCount, faceDetected, headPose, eyeGaze, alerts } = req.body;

      const session = await Session.findOne({
        where: { id: sessionId, userId: req.userId }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Create activity record
      const activity = await Activity.create({
        sessionId,
        userId: req.userId,
        metrics: {
          focusScore: focusScore || 0,
          postureScore: postureScore || 0,
          eyeStrainLevel: eyeStrainLevel || 0,
          distractionCount: distractionCount || 0,
          faceDetected: faceDetected || false,
          headPose: headPose || { pitch: 0, yaw: 0, roll: 0 },
          eyeGaze: eyeGaze || { x: 0, y: 0, onScreen: true }
        },
        alerts: alerts || []
      });

      // Update session metrics
      await session.updateMetrics({
        focusScore: focusScore || 0,
        postureScore: postureScore || 0,
        eyeStrainLevel: eyeStrainLevel || 0,
        distractionCount: distractionCount || 0
      });

      res.json({
        success: true,
        message: 'Metrics saved successfully',
        data: { activity }
      });

    } catch (error) {
      console.error('Save metrics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user sessions
  async getUserSessions(req, res) {
    try {
      const { page = 1, limit = 10, status, subject } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = { userId: req.userId };
      if (status) whereClause.status = status;
      if (subject) whereClause.subject = { [Op.iLike]: `%${subject}%` };

      const { count, rows: sessions } = await Session.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        include: [{
          model: Activity,
          as: 'activities',
          attributes: ['id', 'timestamp', 'metrics']
        }]
      });

      res.json({
        success: true,
        data: {
          sessions,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get user sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get session details
  async getSessionDetails(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await Session.findOne({
        where: { id: sessionId, userId: req.userId },
        include: [{
          model: Activity,
          as: 'activities',
          order: [['timestamp', 'ASC']]
        }]
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Get analytics
      const analytics = await Activity.getSessionAnalytics(sessionId);

      res.json({
        success: true,
        data: {
          session,
          analytics
        }
      });

    } catch (error) {
      console.error('Get session details error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get dashboard analytics
  async getDashboardAnalytics(req, res) {
    try {
      const { days = 7 } = req.query;
      
      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Get user analytics
      const userAnalytics = await Activity.getUserAnalytics(req.userId, parseInt(days));

      // Get recent sessions
      const recentSessions = await Session.findAll({
        where: { userId: req.userId },
        limit: 5,
        order: [['createdAt', 'DESC']]
      });

      // Get weekly progress
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const weeklyProgress = await Session.findAll({
        where: {
          userId: req.userId,
          startTime: { [Op.gte]: startDate },
          status: 'completed'
        },
        order: [['startTime', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          userStats: user.stats,
          analytics: userAnalytics,
          recentSessions,
          weeklyProgress
        }
      });

    } catch (error) {
      console.error('Get dashboard analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new TrackingController();