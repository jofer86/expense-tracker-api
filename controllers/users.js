const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Get all Users
// @route GET /api/v1/Users
// @access Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    count: user.length,
    data: user
  });
});

// @desc Get single botcamp
// @route GET /api/v1/Users/:id
// @access Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc Create a User
// @route POST /api/v1/Users/
// @access Private
exports.createUser = asyncHandler(async (req, res, next) => {
  let userBody = req.body;
  const user = await User.create(userBody);
  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc Update User
// @route PUT /api/v1/Users/:id
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc Delete User
// @route DELETE /api/v1/Users/:id
// @access Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  res.status(200).json({
    success: true,
    data: user
  });
});
