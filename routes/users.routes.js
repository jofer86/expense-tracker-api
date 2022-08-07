const express = require('express');
const router = express.Router();
const {
  addExpense,
  addTransaction,
  createExpenseMonth,
  getMonthTransactions,
  getUsers,
  getUser,
  getUserBank,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users.controller');

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
router.route('/:id/bank').get(getUserBank);
router.route('/:id/expense_months/:expense_month_id').get(getMonthTransactions);
router.route('/:id/create_expense_month').post(createExpenseMonth);
router.route('/:id/add_transaction').post(addTransaction);
router.route('/:id/bank/:bank_id/add_transaction').post(addTransaction);

module.exports = router;
