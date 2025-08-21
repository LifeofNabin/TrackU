// ===== src/middleware/errorMiddleware.js =====
const { envConfig } = require('../config/envConfig');

const errorMiddleware = (error, req, res, next) => {
  console.error('Error caught by middleware:', error);

  // Default error
  let statusCode = error.status || error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    const errors = error.errors.map(err => ({
      field: err.path,
      message: err.message
    }));
    
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }

  // Sequelize unique constraint errors
  if (error.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Resource already exists';
    
    return res.status(statusCode).json({
      success: false,
      message,
      field: error.errors[0]?.path
    });
  }

  // Sequelize foreign key constraint errors
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid reference to related resource';
    
    return res.status(statusCode).json({
      success: false,
      message
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    
    return res.status(statusCode).json({
      success: false,
      message
    });
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    
    return res.status(statusCode).json({
      success: false,
      message,
      code: 'TOKEN_EXPIRED'
    });
  }

  // Multer errors (file upload)
  if (error.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File too large';
    
    return res.status(statusCode).json({
      success: false,
      message
    });
  }

  // Default error response
  const response = {
    success: false,
    message,
    ...(envConfig.NODE_ENV === 'development' && { stack: error.stack })
  };

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;