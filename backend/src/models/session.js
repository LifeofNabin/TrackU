
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  targetDuration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
    validate: {
      min: 1,
      max: 480 // 8 hours max
    }
  },
  actualDuration: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 0
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  },
  goal: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('planned', 'active', 'paused', 'completed', 'cancelled'),
    defaultValue: 'planned'
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  pauseDuration: {
    type: DataTypes.INTEGER, // total pause time in minutes
    defaultValue: 0
  },
  breaks: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  averageMetrics: {
    type: DataTypes.JSONB,
    defaultValue: {
      focusScore: 0,
      postureScore: 0,
      eyeStrainLevel: 0,
      distractionCount: 0
    }
  },
  totalAlerts: {
    type: DataTypes.JSONB,
    defaultValue: {
      focus: 0,
      posture: 0,
      eyeStrain: 0,
      distraction: 0
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  environment: {
    type: DataTypes.JSONB,
    defaultValue: {
      location: null,
      lighting: null,
      noiseLevel: null,
      temperature: null
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['startTime']
    },
    {
      fields: ['subject']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Instance methods
Session.prototype.start = function() {
  this.status = 'active';
  this.startTime = new Date();
  return this.save();
};

Session.prototype.pause = function() {
  this.status = 'paused';
  return this.save();
};

Session.prototype.resume = function() {
  this.status = 'active';
  return this.save();
};

Session.prototype.complete = function() {
  this.status = 'completed';
  this.endTime = new Date();
  
  if (this.startTime) {
    this.actualDuration = Math.floor((this.endTime - this.startTime) / (1000 * 60)) - this.pauseDuration;
  }
  
  return this.save();
};

Session.prototype.addBreak = function(breakData) {
  const breaks = [...this.breaks];
  breaks.push({
    startTime: new Date(),
    duration: breakData.duration || 5,
    type: breakData.type || 'manual',
    reason: breakData.reason || null
  });
  this.breaks = breaks;
  return this.save();
};

Session.prototype.updateMetrics = function(metrics) {
  const current = this.averageMetrics;
  const updated = {
    focusScore: (current.focusScore + metrics.focusScore) / 2,
    postureScore: (current.postureScore + metrics.postureScore) / 2,
    eyeStrainLevel: (current.eyeStrainLevel + metrics.eyeStrainLevel) / 2,
    distractionCount: current.distractionCount + (metrics.distractionCount || 0)
  };
  
  this.averageMetrics = updated;
  return this.save();
};

module.exports = Session;