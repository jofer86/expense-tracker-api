const User = require('../models/User');
const Bank = require('../models/Bank');
const ExpenseMonth = require('../models/ExpenseMonth');
const Transaction = require('../models/Transaction');
const ErrorResponse = require('../utils/errorResponse.utils');
const asyncHandler = require('../middleware/async.middleware');

const throwError = (msg, code) => {
  return new ErrorResponse(msg, code);
};

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
  if (!user) return next(throwError('User not found', 404));

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
  if (!user) return next(throwError('User not found', 404));

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
  if (!user) return next(throwError('User not found', 404));

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc Get the users Bank
// @route GET /api/v1/Users/:id/bank
// @access Public
exports.getUserBank = asyncHandler(async (req, res, next) => {
  const bank = await Bank.findOne({ user: req.params.id });
  if (!bank) return next(throwError('User bank not found', 404));

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
  if (!user) return throwError(`User not found with id of ${req.params.id}`, 404);
  const bank = await Bank.findOne({ user: req.params.id });
  if (!bank) return throwError(`No bank found for user with id of ${req.params.id}`, 404);
  const expenseMonth = await ExpenseMonth.findById(req.body.expense_month_id);
  if (!expenseMonth) return throwError(`Expense month not found`, 404);

  const transaction = new Transaction({
    description: req.body.description,
    amount: req.body.amount,
    transactionType: req.body.transactionType,
    bank: bank._id,
    user: user._id,
    expenseMonth: expenseMonth._id
  });

  const persistData = await user.persistTransaction(transaction, bank, expenseMonth);

  if (!persistData) return throwError(`Transaction not added`, 400);
  res.status(200).json({
    success: true,
    data: persistData
  });
});

// @desc create an expense month.
// @route POST /api/v1/Users/:id/create_expense_month
// @access Public
exports.createExpenseMonth = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return throwError(`User not found with id of ${req.params.id}`, 404);
  const saveExpenseMonth = await user.createExpenseMonth(req.body.name);

  if (!saveExpenseMonth) return throwError(`Expense month not created`, 400);

  return res.status(200).json({
    success: true,
    data: saveExpenseMonth
  });
});

// @desc get all monthly transactions for a user
// @route GET /api/v1/Users/:id/expense_months/:expense_id
// @access Public
exports.getMonthTransactions = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return throwError(`User not found with id of ${req.params.id}`, 404);

  const transactions = await user.getMonthTransactions(req.params.expense_month_id, req.query.type);

  if (!transactions) return throwError(`No transactions found for user with id of ${req.params.id}`, 404);

  return res.status(200).json({
    success: true,
    data: transactions
  });
});
