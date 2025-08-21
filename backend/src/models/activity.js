// ===== src/models/activity.js =====
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Sessions',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  metrics: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      focusScore: 0,
      postureScore: 0,
      eyeStrainLevel: 0,
      distractionCount: 0,
      faceDetected: false,
      headPose: {
        pitch: 0,
        yaw: 0,
        roll: 0
      },
      eyeGaze: {
        x: 0,
        y: 0,
        onScreen: true
      },
      emotionDetected: null
    }
  },
  alerts: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  rawData: {
    type: DataTypes.JSONB,
    allowNull: true // Store raw face detection data if needed for analysis
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['sessionId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['timestamp']
    },
    {
      fields: ['sessionId', 'timestamp']
    }
  ]
});

// Static methods for analytics
Activity.getSessionAnalytics = async function(sessionId) {
  const activities = await this.findAll({
    where: { sessionId },
    order: [['timestamp', 'ASC']]
  });

  if (activities.length === 0) {
    return null;
  }

  const metrics = activities.map(a => a.metrics);
  const totalAlerts = activities.reduce((acc, activity) => {
    activity.alerts.forEach(alert => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
    });
    return acc;
  }, {});

  return {
    totalDataPoints: activities.length,
    averageMetrics: {
      focusScore: metrics.reduce((sum, m) => sum + m.focusScore, 0) / metrics.length,
      postureScore: metrics.reduce((sum, m) => sum + m.postureScore, 0) / metrics.length,
      eyeStrainLevel: metrics.reduce((sum, m) => sum + m.eyeStrainLevel, 0) / metrics.length,
      distractionCount: metrics.reduce((sum, m) => sum + m.distractionCount, 0)
    },
    totalAlerts,
    timeRange: {
      start: activities[0].timestamp,
      end: activities[activities.length - 1].timestamp
    },
    faceDetectionRate: (metrics.filter(m => m.faceDetected).length / metrics.length) * 100
  };
};

Activity.getUserAnalytics = async function(userId, dateRange = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - dateRange);

  const activities = await this.findAll({
    where: {
      userId,
      timestamp: {
        [sequelize.Op.gte]: startDate
      }
    },
    order: [['timestamp', 'DESC']]
  });

  // Group by day for trend analysis
  const dailyStats = activities.reduce((acc, activity) => {
    const day = activity.timestamp.toDateString();
    if (!acc[day]) {
      acc[day] = {
        activities: [],
        totalFocusTime: 0,
        alertCounts: {}
      };
    }
    acc[day].activities.push(activity);
    return acc;
  }, {});

  return {
    totalActivities: activities.length,
    dailyStats,
    overallTrends: {
      averageFocusScore: activities.reduce((sum, a) => sum + a.metrics.focusScore, 0) / activities.length,
      averagePostureScore: activities.reduce((sum, a) => sum + a.metrics.postureScore, 0) / activities.length,
      totalStudyTime: Object.keys(dailyStats).length * 60, // Approximate
      improvementRate: calculateImprovementRate(activities)
    }
  };
};

function calculateImprovementRate(activities) {
  if (activities.length < 10) return 0;
  
  const firstHalf = activities.slice(0, Math.floor(activities.length / 2));
  const secondHalf = activities.slice(Math.floor(activities.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, a) => sum + a.metrics.focusScore, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, a) => sum + a.metrics.focusScore, 0) / secondHalf.length;
  
  return ((secondAvg - firstAvg) / firstAvg) * 100;
}

module.exports = Activity;

