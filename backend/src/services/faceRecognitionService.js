// const cv = require('opencv4nodejs'); 
const { envConfig } = require('../config/envConfig');

class FaceRecognitionService {
  constructor() {
    this.confidenceThreshold = envConfig.FACE_DETECTION_CONFIDENCE;
    this.calibrationData = new Map(); // Store per-user calibration
  }

  // Analyze a single frame
  async analyzeFrame(frameData) {
    try {
      // Convert base64 to buffer if needed
      let imageData = frameData;
      if (typeof frameData === 'string' && frameData.startsWith('data:image')) {
        const base64Data = frameData.split(',')[1];
        imageData = Buffer.from(base64Data, 'base64');
      }

      // Mock face detection data - replace with actual MediaPipe/OpenCV implementation
      const faceData = await this.mockFaceDetection(imageData);

      return {
        faceDetected: faceData.faceDetected,
        confidence: faceData.confidence,
        boundingBox: faceData.boundingBox,
        landmarks: faceData.landmarks,
        headPose: faceData.headPose,
        eyeGaze: faceData.eyeGaze,
        emotions: faceData.emotions,
        qualityMetrics: faceData.qualityMetrics,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Frame analysis error:', error);
      return this.getDefaultFaceData();
    }
  }

  // Mock face detection (replace with real implementation)
  async mockFaceDetection(imageData) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 10));

    // Generate realistic mock data
    const faceDetected = Math.random() > 0.1; // 90% detection rate
    
    if (!faceDetected) {
      return {
        faceDetected: false,
        confidence: 0,
        boundingBox: null,
        landmarks: null,
        headPose: null,
        eyeGaze: null,
        emotions: null,
        qualityMetrics: null
      };
    }

    return {
      faceDetected: true,
      confidence: 0.85 + Math.random() * 0.15, // 85-100% confidence
      boundingBox: {
        x: 150 + Math.random() * 100,
        y: 100 + Math.random() * 50,
        width: 200 + Math.random() * 50,
        height: 250 + Math.random() * 50
      },
      landmarks: this.generateFaceLandmarks(),
      headPose: {
        pitch: (Math.random() - 0.5) * 30, // -15 to 15 degrees
        yaw: (Math.random() - 0.5) * 40,   // -20 to 20 degrees
        roll: (Math.random() - 0.5) * 20   // -10 to 10 degrees
      },
      eyeGaze: {
        x: 0.4 + Math.random() * 0.2, // 0.4 to 0.6 (center-ish)
        y: 0.4 + Math.random() * 0.2, // 0.4 to 0.6 (center-ish)
        onScreen: Math.random() > 0.2  // 80% on screen
      },
      emotions: {
        neutral: 0.6 + Math.random() * 0.3,
        focused: 0.1 + Math.random() * 0.2,
        tired: Math.random() * 0.15,
        distracted: Math.random() * 0.1
      },
      qualityMetrics: {
        brightness: 0.6 + Math.random() * 0.3,
        sharpness: 0.7 + Math.random() * 0.2,
        angle: Math.abs((Math.random() - 0.5) * 60) // 0-30 degrees
      }
    };
  }

  // Generate realistic face landmarks
  generateFaceLandmarks() {
    const landmarks = [];
    
    // Generate 68-point face landmarks (simplified)
    for (let i = 0; i < 68; i++) {
      landmarks.push({
        x: 200 + Math.random() * 200,
        y: 150 + Math.random() * 250,
        z: Math.random() * 50
      });
    }
    
    return landmarks;
  }

  // Calculate focus score based on face data
  calculateFocusScore(faceData) {
    if (!faceData.faceDetected) return 0;

    let score = 70; // Base score

    // Head pose analysis
    const { pitch, yaw, roll } = faceData.headPose;
    const headPoseScore = Math.max(0, 100 - (Math.abs(pitch) + Math.abs(yaw) + Math.abs(roll)));
    score = (score + headPoseScore) / 2;

    // Eye gaze analysis
    if (faceData.eyeGaze.onScreen) {
      const gazeScore = 100 - (Math.abs(faceData.eyeGaze.x - 0.5) + Math.abs(faceData.eyeGaze.y - 0.5)) * 200;
      score = (score + Math.max(0, gazeScore)) / 2;
    } else {
      score *= 0.5; // Significant penalty for looking away
    }

    // Emotion analysis
    if (faceData.emotions) {
      const emotionScore = (faceData.emotions.focused * 100) + (faceData.emotions.neutral * 80) - (faceData.emotions.distracted * 50);
      score = (score + Math.max(0, emotionScore)) / 2;
    }

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  // Calculate posture score
  calculatePostureScore(faceData) {
    if (!faceData.faceDetected) return 0;

    let score = 80; // Base score

    // Head pose analysis for posture
    const { pitch, yaw, roll } = faceData.headPose;
    
    // Penalize extreme head tilts
    if (Math.abs(pitch) > 15) score -= Math.abs(pitch) * 2;
    if (Math.abs(yaw) > 20) score -= Math.abs(yaw) * 1.5;
    if (Math.abs(roll) > 10) score -= Math.abs(roll) * 3;

    // Quality metrics affect posture score
    if (faceData.qualityMetrics) {
      const angleScore = Math.max(0, 100 - faceData.qualityMetrics.angle * 2);
      score = (score + angleScore) / 2;
    }

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  // Calculate eye strain level
  calculateEyeStrainLevel(faceData, sessionDuration = 0) {
    let strainLevel = 0;

    // Base strain increases with session duration
    strainLevel += Math.min(sessionDuration / 60 * 10, 40); // Max 40 from duration

    if (!faceData.faceDetected) return Math.round(strainLevel);

    // Blinking rate analysis (mock)
    const mockBlinkRate = 15 + Math.random() * 10; // 15-25 blinks per minute
    if (mockBlinkRate < 12) strainLevel += 20;
    if (mockBlinkRate > 30) strainLevel += 10;

    // Eye gaze stability
    if (faceData.eyeGaze && !faceData.eyeGaze.onScreen) {
      strainLevel += 5;
    }

    // Quality metrics
    if (faceData.qualityMetrics) {
      if (faceData.qualityMetrics.brightness < 0.4) strainLevel += 15;
      if (faceData.qualityMetrics.brightness > 0.9) strainLevel += 10;
    }

    return Math.round(Math.max(0, Math.min(100, strainLevel)));
  }

  // Calibrate face detection for a user
  async calibrate(calibrationFrames) {
    try {
      const calibrationResults = [];

      for (const frame of calibrationFrames) {
        const faceData = await this.analyzeFrame(frame.data);
        calibrationResults.push({
          position: frame.position, // 'center', 'left', 'right', etc.
          faceData
        });
      }

      // Store calibration data (in production, save to database)
      const calibrationId = `cal_${Date.now()}`;
      this.calibrationData.set(calibrationId, {
        results: calibrationResults,
        timestamp: new Date(),
        avgConfidence: calibrationResults.reduce((sum, r) => sum + (r.faceData.confidence || 0), 0) / calibrationResults.length
      });

      return {
        calibrationId,
        avgConfidence: this.calibrationData.get(calibrationId).avgConfidence,
        detectionRate: calibrationResults.filter(r => r.faceData.faceDetected).length / calibrationResults.length,
        recommendations: this.generateCalibrationRecommendations(calibrationResults)
      };

    } catch (error) {
      console.error('Calibration error:', error);
      throw new Error('Calibration failed');
    }
  }

  // Generate calibration recommendations
  generateCalibrationRecommendations(results) {
    const recommendations = [];
    const avgConfidence = results.reduce((sum, r) => sum + (r.faceData.confidence || 0), 0) / results.length;

    if (avgConfidence < 0.7) {
      recommendations.push({
        type: 'lighting',
        message: 'Improve lighting conditions for better face detection',
        priority: 'high'
      });
    }

    const detectionRate = results.filter(r => r.faceData.faceDetected).length / results.length;
    if (detectionRate < 0.8) {
      recommendations.push({
        type: 'position',
        message: 'Adjust camera position to ensure face is clearly visible',
        priority: 'high'
      });
    }

    const avgBrightness = results.reduce((sum, r) => sum + (r.faceData.qualityMetrics?.brightness || 0), 0) / results.length;
    if (avgBrightness < 0.4) {
      recommendations.push({
        type: 'brightness',
        message: 'Increase ambient lighting or adjust camera settings',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  // Get detection status
  getDetectionStatus(recentActivities) {
    if (!recentActivities || recentActivities.length === 0) {
      return {
        status: 'no_data',
        confidence: 0,
        lastDetection: null,
        detectionRate: 0
      };
    }

    const detectedCount = recentActivities.filter(a => a.metrics.faceDetected).length;
    const detectionRate = detectedCount / recentActivities.length;
    const lastActivity = recentActivities[0];

    let status = 'good';
    if (detectionRate < 0.5) status = 'poor';
    else if (detectionRate < 0.8) status = 'fair';

    return {
      status,
      confidence: lastActivity.metrics.confidence || 0,
      lastDetection: lastActivity.timestamp,
      detectionRate: Math.round(detectionRate * 100),
      currentlyDetected: lastActivity.metrics.faceDetected
    };
  }

  // Get face detection analytics
  async getAnalytics(sessionId, timeRange) {
    const timeRangeMs = this.parseTimeRange(timeRange);
    const startTime = new Date(Date.now() - timeRangeMs);

    const activities = await Activity.findAll({
      where: {
        sessionId,
        timestamp: { [Op.gte]: startTime }
      },
      order: [['timestamp', 'ASC']]
    });

    if (activities.length === 0) {
      return this.getEmptyAnalytics();
    }

    const metrics = activities.map(a => a.metrics);
    const detectedCount = metrics.filter(m => m.faceDetected).length;

    return {
      timeRange,
      totalDataPoints: activities.length,
      detectionRate: Math.round((detectedCount / activities.length) * 100),
      avgConfidence: metrics.reduce((sum, m) => sum + (m.confidence || 0), 0) / metrics.length,
      avgFocusScore: metrics.reduce((sum, m) => sum + (m.focusScore || 0), 0) / metrics.length,
      avgPostureScore: metrics.reduce((sum, m) => sum + (m.postureScore || 0), 0) / metrics.length,
      timeline: this.generateTimeline(activities),
      alerts: this.analyzeAlerts(activities),
      recommendations: this.generateRecommendations(metrics)
    };
  }

  // Parse time range string
  parseTimeRange(timeRange) {
    const units = {
      'm': 60 * 1000,          // minutes
      'h': 60 * 60 * 1000,     // hours
      'd': 24 * 60 * 60 * 1000 // days
    };

    const match = timeRange.match(/^(\d+)([mhd])$/);
    if (!match) return 60 * 60 * 1000; // Default 1 hour

    const [, amount, unit] = match;
    return parseInt(amount) * units[unit];
  }

  // Generate timeline data
  generateTimeline(activities) {
    const timeline = [];
    const interval = Math.max(1, Math.floor(activities.length / 50)); // Max 50 points

    for (let i = 0; i < activities.length; i += interval) {
      const batch = activities.slice(i, i + interval);
      const avgMetrics = this.calculateAverageMetrics(batch);
      
      timeline.push({
        timestamp: batch[0].timestamp,
        metrics: avgMetrics
      });
    }

    return timeline;
  }

  // Calculate average metrics for a batch
  calculateAverageMetrics(activities) {
    const metrics = activities.map(a => a.metrics);
    
    return {
      focusScore: metrics.reduce((sum, m) => sum + (m.focusScore || 0), 0) / metrics.length,
      postureScore: metrics.reduce((sum, m) => sum + (m.postureScore || 0), 0) / metrics.length,
      eyeStrainLevel: metrics.reduce((sum, m) => sum + (m.eyeStrainLevel || 0), 0) / metrics.length,
      faceDetected: metrics.filter(m => m.faceDetected).length / metrics.length > 0.5
    };
  }

  // Analyze alerts
  analyzeAlerts(activities) {
    const alertCounts = {};
    const alertTypes = ['focus', 'posture', 'eye_strain', 'detection'];

    alertTypes.forEach(type => {
      alertCounts[type] = activities.reduce((count, activity) => {
        return count + (activity.alerts?.filter(alert => alert.type === type).length || 0);
      }, 0);
    });

    return alertCounts;
  }

  // Generate recommendations
  generateRecommendations(metrics) {
    const recommendations = [];
    
    const avgFocus = metrics.reduce((sum, m) => sum + (m.focusScore || 0), 0) / metrics.length;
    const avgPosture = metrics.reduce((sum, m) => sum + (m.postureScore || 0), 0) / metrics.length;
    const avgEyeStrain = metrics.reduce((sum, m) => sum + (m.eyeStrainLevel || 0), 0) / metrics.length;

    if (avgFocus < 60) {
      recommendations.push({
        type: 'focus',
        priority: 'high',
        message: 'Consider taking a short break to improve focus',
        action: 'Take a 5-minute break and do some deep breathing'
      });
    }

    if (avgPosture < 50) {
      recommendations.push({
        type: 'posture',
        priority: 'high',
        message: 'Adjust your sitting position',
        action: 'Sit up straight and adjust your monitor height'
      });
    }

    if (avgEyeStrain > 70) {
      recommendations.push({
        type: 'eye_strain',
        priority: 'medium',
        message: 'High eye strain detected',
        action: 'Follow the 20-20-20 rule: look at something 20 feet away for 20 seconds'
      });
    }

    return recommendations;
  }

  // Get default face data when detection fails
  getDefaultFaceData() {
    return {
      faceDetected: false,
      confidence: 0,
      boundingBox: null,
      landmarks: null,
      headPose: null,
      eyeGaze: null,
      emotions: null,
      qualityMetrics: null,
      timestamp: new Date()
    };
  }

  // Get empty analytics
  getEmptyAnalytics() {
    return {
      totalDataPoints: 0,
      detectionRate: 0,
      avgConfidence: 0,
      avgFocusScore: 0,
      avgPostureScore: 0,
      timeline: [],
      alerts: {},
      recommendations: []
    };
  }
}

module.exports = new FaceRecognitionService();