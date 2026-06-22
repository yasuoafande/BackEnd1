const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function sendAuthResponse(user, statusCode, res) {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
}

const register = asyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  sendAuthResponse(user, 201, res);
});

const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');

  if (!user || !(await user.comparePassword(req.body.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (!user.isActive) {
    return next(new AppError('This account is disabled', 403));
  }

  sendAuthResponse(user, 200, res);
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});

module.exports = {
  getMe,
  login,
  register,
};
