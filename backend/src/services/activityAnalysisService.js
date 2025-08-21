// src/services/activityAnalysisService.js =====
const faceRecognitionService = require('./faceRecognitionService');

class ActivityAnalysisService {
  // Analyze activity and generate metrics
  analyzeActivity(faceData, session) {
    const sessionDuration = this.getSessionDuration(session);
    
    const metrics = {
      focusScore: faceRecognitionService.calculateFocusScore(faceData),
      postureScore: faceRecognitionService.calculatePostureScore(faceData),
      eyeStrainLevel: faceRecognitionService.calculateEyeStrainLevel(faceData, sessionDuration),
      distractionCount: this.calculateDistractionCount(faceData),
      faceDetected: faceData.faceDetected,
      headPose: faceData.headPose,
      eyeGaze: faceData.eyeGaze,
      emotionDetected: this.getPrimaryEmotion(faceData.emotions)
    };

    const alerts = this.generateAlerts(metrics, session);
    const recommendations = this.generateRecommendations(metrics, sessionDuration);

    return {
      metrics,
      alerts,
      recommendations
    };
  }

  // Get session duration in minutes
  getSessionDuration(session) {
    if (!session.startTime) return 0;
    return Math.floor((new Date() - new Date(session.startTime)) / (1000 * 60));
  }

  // Calculate distraction count
  calculateDistractionCount(faceData) {
    let distractions = 0;

    if (!faceData.faceDetected) distractions += 1;
    
    if (faceData.eyeGaze && !faceData.eyeGaze.onScreen) {
      distractions += 1;
    }

    if (faceData.headPose) {
      const { pitch, yaw, roll } = faceData.headPose;
      if (Math.abs(yaw) > 30) distractions += 1; // Looking away
      if (Math.abs(pitch) > 20) distractions += 1; // Looking up/down
    }

    if (faceData.emotions && faceData.emotions.distracted > 0.5) {
      distractions += 1;
    }

    return distractions;
  }

  // Get primary emotion
  getPrimaryEmotion(emotions) {
    if (!emotions) return null;

    let maxEmotion = null;
    let maxValue = 0;

    Object.entries(emotions).forEach(([emotion, value]) => {
      if (value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    });

    return maxValue > 0.3 ? maxEmotion : 'neutral';
  }

  // Generate alerts based on metrics
  generateAlerts(metrics, session) {
    const alerts = [];
    const timestamp = new Date();

    // Focus alerts
    if (metrics.focusScore < 30) {
      alerts.push({
        type: 'focus',
        level: 'high',
        message: 'Very low focus detected. Consider taking a break.',
        timestamp,
        action: 'break'
      });
    } else if (metrics.focusScore < 50) {
      alerts.push({
        type: 'focus',
        level: 'medium',
        message: 'Focus level is declining. Try to eliminate distractions.',
        timestamp,
        action: 'refocus'
      });
    }

    // Posture alerts
    if (metrics.postureScore < 40) {
      alerts.push({
        type: 'posture',
        level: 'high',
        message: 'Poor posture detected. Adjust your sitting position.',
        timestamp,
        action: 'adjust_posture'
      });
    } else if (metrics.postureScore < 60) {
      alerts.push({
        type: 'posture',
        level: 'medium',
        message: 'Slouching detected. Sit up straight.',
        timestamp,
        action: 'sit_straight'
      });
    }

    // Eye strain alerts
    if (metrics.eyeStrainLevel > 80) {
      alerts.push({
        type: 'eye_strain',
        level: 'high',
        message: 'High eye strain. Take a break and rest your eyes.',
        timestamp,
        action: 'eye_break'
      });
    } else if (metrics.eyeStrainLevel > 60) {
      alerts.push({
        type: 'eye_strain',
        level: 'medium',
        message: 'Moderate eye strain. Look away from screen periodically.',
        timestamp,
        action: 'look_away'
      });
    }

    // Face detection alerts
    if (!metrics.faceDetected) {
      alerts.push({
        type: 'detection',
        level: 'medium',
        message: 'Face not detected. Please stay in view of the camera.',
        timestamp,
        action: 'adjust_camera'
      });
    }

    // Distraction alerts
    if (metrics.distractionCount >= 3) {
      alerts.push({
        type: 'distraction',
        level: 'high',
        message: 'Multiple distractions detected. Try to focus on your study material.',
        timestamp,
        action: 'eliminate_distractions'
      });
    }

    return alerts;
  }

  // Generate recommendations
  generateRecommendations(metrics, sessionDuration) {
    const recommendations = [];

    // Session duration recommendations
    if (sessionDuration > 90) {
      recommendations.push({
        type: 'break',
        priority: 'high',
        message: 'You\'ve been studying for over 90 minutes. Take a longer break.',
        duration: 15,
        activity: 'Take a walk and get some fresh air'
      });
    } else if (sessionDuration > 0 && sessionDuration % 25 === 0) {
      recommendations.push({
        type: 'pomodoro_break',
        priority: 'medium',
        message: 'Time for a Pomodoro break!',
        duration: 5,
        activity: 'Stand up, stretch, and hydrate'
      });
    }

    // Performance-based recommendations
    if (metrics.focusScore < 60 && metrics.eyeStrainLevel > 50) {
      recommendations.push({
        type: 'eye_rest',
        priority: 'high',
        message: 'Low focus and eye strain detected',
        duration: 10,
        activity: 'Close your eyes and practice deep breathing'
      });
    }

    if (metrics.postureScore < 50) {
      recommendations.push({
        type: 'posture_exercise',
        priority: 'medium',
        message: 'Poor posture detected',
        duration: 3,
        activity: 'Do neck rolls and shoulder shrugs'
      });
    }

    // Environment recommendations
    if (metrics.distractionCount > 2) {
      recommendations.push({
        type: 'environment',
        priority: 'medium',
        message: 'High distraction level',
        duration: 0,
        activity: 'Clear your workspace and minimize distractions'
      });
    }

    return recommendations;
  }

  // Analyze long-term patterns
  analyzeLongTermPatterns(userActivities) {
    // This would analyze patterns over multiple sessions
    // For now, return basic analysis
    
    const totalActivities = userActivities.length;
    if (totalActivities < 10) {
      return {
        hasEnoughData: false,
        message: 'Need more study sessions for pattern analysis'
      };
    }

    const avgFocus = userActivities.reduce((sum, a) => sum + a.metrics.focusScore, 0) / totalActivities;
    const avgPosture = userActivities.reduce((sum, a) => sum + a.metrics.postureScore, 0) / totalActivities;
    const avgEyeStrain = userActivities.reduce((sum, a) => sum + a.metrics.eyeStrainLevel, 0) / totalActivities;

    // Identify trends
    const recentActivities = userActivities.slice(-20); // Last 20 sessions
    const olderActivities = userActivities.slice(0, -20);
    
    if (olderActivities.length > 0) {
      const recentAvgFocus = recentActivities.reduce((sum, a) => sum + a.metrics.focusScore, 0) / recentActivities.length;
      const olderAvgFocus = olderActivities.reduce((sum, a) => sum + a.metrics.focusScore, 0) / olderActivities.length;
      
      const focusTrend = recentAvgFocus - olderAvgFocus;
      
      return {
        hasEnoughData: true,
        averages: { focus: avgFocus, posture: avgPosture, eyeStrain: avgEyeStrain },
        trends: {
          focus: focusTrend > 5 ? 'improving' : focusTrend < -5 ? 'declining' : 'stable'
        },
        recommendations: this.generateLongTermRecommendations(avgFocus, avgPosture, avgEyeStrain)
      };
    }

    return {
      hasEnoughData: true,
      averages: { focus: avgFocus, posture: avgPosture, eyeStrain: avgEyeStrain },
      trends: { focus: 'stable' },
      recommendations: this.generateLongTermRecommendations(avgFocus, avgPosture, avgEyeStrain)
    };
  }

  // Generate long-term recommendations
  generateLongTermRecommendations(avgFocus, avgPosture, avgEyeStrain) {
    const recommendations = [];

    if (avgFocus < 70) {
      recommendations.push({
        type: 'focus_training',
        message: 'Consider focus training exercises',
        suggestion: 'Practice meditation or mindfulness exercises daily'
      });
    }

    if (avgPosture < 60) {
      recommendations.push({
        type: 'ergonomics',
        message: 'Improve your study environment ergonomics',
        suggestion: 'Adjust chair height and monitor position'
      });
    }

    if (avgEyeStrain > 60) {
      recommendations.push({
        type: 'eye_care',
        message: 'Take better care of your eyes',
        suggestion: 'Use blue light filters and ensure proper lighting'
      });
    }

    return recommendations;
  }
}

module.exports = new ActivityAnalysisService();