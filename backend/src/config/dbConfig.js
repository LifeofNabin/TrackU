// ===== src/config/dbConfig.js =====
const { Sequelize } = require('sequelize');
const { envConfig } = require('./envConfig');

let sequelize;

if (envConfig.DATABASE_URL) {
  // Production: Use DATABASE_URL
  sequelize = new Sequelize(envConfig.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: envConfig.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: envConfig.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Development: Use individual config
  sequelize = new Sequelize(
    envConfig.DB_NAME,
    envConfig.DB_USER,
    envConfig.DB_PASSWORD,
    {
      host: envConfig.DB_HOST,
      port: envConfig.DB_PORT,
      dialect: 'postgres',
      logging: envConfig.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully');
  })
  .catch(err => {
    console.error('❌ Unable to connect to database:', err);
  });

module.exports = sequelize;