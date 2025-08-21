const redis = require('redis');
const { envConfig } = require('./envConfig');

let redisClient = null;

if (envConfig.REDIS_URL) {
  redisClient = redis.createClient({
    url: envConfig.REDIS_URL,
    password: envConfig.REDIS_PASSWORD,
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        console.error('Redis server refused connection');
        return new Error('Redis server refused connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        console.error('Redis retry time exhausted');
        return new Error('Redis retry time exhausted');
      }
      if (options.attempt > 10) {
        console.error('Redis connection attempts exceeded');
        return undefined;
      }
      return Math.min(options.attempt * 100, 3000);
    }
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
  });

  redisClient.on('ready', () => {
    console.log('📡 Redis client ready');
  });

  redisClient.on('end', () => {
    console.log('🔌 Redis connection ended');
  });
}

module.exports = redisClient;