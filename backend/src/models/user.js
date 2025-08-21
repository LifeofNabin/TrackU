// ===== src/models/user.js =====
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/dbConfig');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 100]
    }
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  emailVerificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {
      notifications: {
        email: true,
        push: true,
        breakReminders: true
      },
      studySettings: {
        defaultSessionLength: 60,
        breakInterval: 25,
        focusThreshold: 70,
        postureThreshold: 60
      },
      privacy: {
        shareStats: false,
        saveVideoData: false
      }
    }
  },
  stats: {
    type: DataTypes.JSONB,
    defaultValue: {
      totalStudyTime: 0,
      totalSessions: 0,
      averageFocusScore: 0,
      averagePostureScore: 0,
      streakDays: 0,
      lastStudyDate: null
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['lastLoginAt']
    }
  ]
});

// Hooks
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toSafeObject = function() {
  const { id, firstName, lastName, email, profileImage, isEmailVerified, 
          preferences, stats, createdAt, lastLoginAt } = this;
  return {
    id, firstName, lastName, email, profileImage, isEmailVerified,
    preferences, stats, createdAt, lastLoginAt
  };
};

User.prototype.updateStats = async function(sessionData) {
  const newStats = { ...this.stats };
  
  newStats.totalStudyTime += sessionData.duration || 0;
  newStats.totalSessions += 1;
  
  // Calculate average scores
  const totalSessions = newStats.totalSessions;
  newStats.averageFocusScore = ((newStats.averageFocusScore * (totalSessions - 1)) + (sessionData.averageFocusScore || 0)) / totalSessions;
  newStats.averagePostureScore = ((newStats.averagePostureScore * (totalSessions - 1)) + (sessionData.averagePostureScore || 0)) / totalSessions;
  
  // Update streak
  const today = new Date().toDateString();
  const lastStudy = newStats.lastStudyDate ? new Date(newStats.lastStudyDate).toDateString() : null;
  
  if (lastStudy === today) {
    // Same day, no streak change
  } else if (lastStudy === new Date(Date.now() - 86400000).toDateString()) {
    // Yesterday, increment streak
    newStats.streakDays += 1;
  } else if (lastStudy) {
    // Gap in days, reset streak
    newStats.streakDays = 1;
  } else {
    // First time
    newStats.streakDays = 1;
  }
  
  newStats.lastStudyDate = new Date();
  
  this.stats = newStats;
  await this.save();
};

module.exports = User;