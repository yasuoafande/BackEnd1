const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
}

function normalizeError(error) {
  if (error.name === 'CastError') {
    return new AppError('Invalid resource id', 400);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    return new AppError(`${field} already exists`, 409);
  }

  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors)
      .map((item) => item.message)
      .join(', ');
    return new AppError(message, 400);
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return new AppError('Invalid or expired token', 401);
  }

  return error;
}

function errorHandler(error, req, res, next) {
  const normalized = normalizeError(error);
  const statusCode = normalized.statusCode || 500;

  res.status(statusCode).json({
    status: normalized.status || 'error',
    message:
      statusCode === 500 && process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : normalized.message,
  });
}

module.exports = {
  errorHandler,
  notFound,
};
