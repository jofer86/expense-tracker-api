const ErrorResponse = require('../utils/errorResponse.utils');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log('This is the error'.red.bold, error.message);

  if (error.message.includes('Cast to ObjectId failed')) {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Duplicate Key
  if (error.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Server Error',
    success: false
  });
};

module.exports = errorHandler;
