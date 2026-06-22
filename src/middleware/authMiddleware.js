const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

function readToken(req) {
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }

  return null;
}

const protect = asyncHandler(async (req, res, next) => {
  const token = readToken(req);

  if (!token) {
    return next(new AppError('Authentication token is required', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    return next(new AppError('User account is not available', 401));
  }

  req.user = user;
  return next();
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = readToken(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch (error) {
    req.user = null;
  }

  return next();
});

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission for this action', 403));
    }

    return next();
  };
}

module.exports = {
  authorize,
  optionalAuth,
  protect,
};
