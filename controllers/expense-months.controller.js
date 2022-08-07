const ExpenseMonth = require('../models/ExpenseMonth');
const Transaction = require('../models/Transaction');
const asyncHandler = require('../middleware/async.middleware');

const throwError = (msg, code) => {
  return new ErrorResponse(msg, code);
};

// @desc Get all ExpenseMonths
// @route GET /api/v1/users/:id/expense_months
// @access Public
exports.getExpenseMonths = asyncHandler(async (req, res, next) => {
  const expenseMonths = await ExpenseMonth.find({ user: req.params.id });
  res.status(200).json({
    success: true,
    count: expenseMonths.length,
    data: expenseMonths
  });
});

// @desc Get single ExpenseMonth
// @route GET /api/v1/users/:id/expense_months/:expense_month_id
// @access Public
exports.getExpenseMonth = asyncHandler(async (req, res, next) => {
  const expenseMonth = await ExpenseMonth.findById(req.params.expense_month_id);
  let type = req.query?.type;
  let transactions;
  if (type) {
    transactions = await Transaction.find({ expenseMonth: expenseMonth._id, transactionType: type }).select(
      '_id description amount transactionType createdAt'
    );
  } else {
    transactions = await Transaction.find({ expenseMonth: expenseMonth._id }).select(
      '_id description amount transactionType createdAt'
    );
  }

  let payload = { ...expenseMonth.toObject(), transactions: transactions };

  res.status(200).json({
    success: true,
    data: payload
  });
});

// @desc create an expense month.
// @route POST /api/v1/Users/:id/create_expense_month
// @access Public
exports.createExpenseMonth = asyncHandler(async (req, res, next) => {
  const expenseMonth = new ExpenseMonth({
    user: req.params.id,
    name: req.body.name
  });

  if (!expenseMonth.save()) return throwError(`Expense month not created`, 400);

  return res.status(200).json({
    success: true,
    data: saveExpenseMonth
  });
});

// @desc Update an expense month.
// @route PUT /api/v1/Users/:id/expense_months/:expense_month_id
// @access Public
exports.updateExpenseMonth = asyncHandler(async (req, res, next) => {
  const expenseMonth = await ExpenseMonth.findById(req.params.expense_month_id);
  if (!expenseMonth) return next(throwError('ExpenseMonth not found', 404));

  expenseMonth.name = req.body.name;
  if (!expenseMonth.save()) return throwError(`Expense month not updated`, 400);

  return res.status(200).json({
    success: true,
    data: expenseMonth
  });
});
