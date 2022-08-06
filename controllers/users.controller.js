const User = require('../models/User');
const Bank = require('../models/Bank');
const ExpenseMonth = require('../models/ExpenseMonth');
const Transaction = require('../models/Transaction');
const ErrorResponse = require('../utils/errorResponse.utils');
const asyncHandler = require('../middleware/async.middleware');

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

// @desc Get the users Bank
// @route GET /api/v1/Users/:id/bank
// @access Public
exports.getUserBank = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  const bank = await Bank.findOne({ user: user._id });
  res.status(200).json({
    success: true,
    data: bank
  });
});

// @desc add an expense to the users bank
// @route POST /api/v1/Users/:id/add_transaction
// @access Public
exports.addTransaction = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  const bank = await Bank.findOne({ user: req.params.id });
  if (!bank) {
    return next(new ErrorResponse(`Bank not found with id of ${req.params.id}`, 404));
  }
  const expenseMonth = await ExpenseMonth.findById(req.body.expense_month_id);
  if (!expenseMonth) {
    return next(new ErrorResponse(`Expense Month not found with id of ${req.params.id}`, 404));
  }

  const transaction = new Transaction({
    description: req.body.description,
    amount: req.body.amount,
    transactionType: req.body.transactionType,
    bank: bank._id,
    user: user._id,
    expenseMonth: expenseMonth._id
  });

  if (transaction.transactionType === 'expense') {
    bank.totalBalance -= transaction.amount;
    bank.totalExpense += transaction.amount;
    expenseMonth.totalExpense += transaction.amount;
    expenseMonth.totalBalance -= transaction.amount;
  }

  if (transaction.transactionType === 'income') {
    bank.totalBalance += transaction.amount;
    bank.totalIncome += transaction.amount;
    expenseMonth.totalIncome += transaction.amount;
    expenseMonth.totalBalance += transaction.amount;
  }

  try {
    await expenseMonth.save();
    await transaction.save();
    await bank.save();
    res.status(200).json({
      success: true,
      data: {
        user,
        bank,
        transaction,
        expenseMonth
      }
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc create an expense month.
// @route POST /api/v1/Users/:id/create_expense_month
// @access Public
exports.createExpenseMonth = asyncHandler(async (req, res, next) => {
  const expenseMonth = new ExpenseMonth({
    name: req.body.name
  });

  if (expenseMonth.save()) {
    res.status(200).json({
      success: true,
      data: expenseMonth
    });
  }

  return next(new ErrorResponse(`Something aint right`, 500));
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
