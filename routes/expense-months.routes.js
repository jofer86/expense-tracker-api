const express = require('express');
const router = express.Router();
const {
  createExpenseMonth,
  getExpenseMonths,
  getExpenseMonth,
  updateExpenseMonth
} = require('../controllers/expense-months.controller');

router.route('/').get(getExpenseMonths).post(createExpenseMonth);
router.route('/:expense_month_id').get(getExpenseMonth).put(updateExpenseMonth);

module.exports = router;
