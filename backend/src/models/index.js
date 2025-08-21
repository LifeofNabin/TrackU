//  src/models/index.js =====
const sequelize = require('../config/dbConfig');
const User = require('./user');
const Session = require('./session');
const Activity = require('./activity');

// Define associations
User.hasMany(Session, {
  foreignKey: 'userId',
  as: 'sessions'
});

Session.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Session.hasMany(Activity, {
  foreignKey: 'sessionId',
  as: 'activities'
});

Activity.belongsTo(Session, {
  foreignKey: 'sessionId',
  as: 'session'
});

Activity.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Activity, {
  foreignKey: 'userId',
  as: 'activities'
});

module.exports = {
  sequelize,
  User,
  Session,
  Activity
};