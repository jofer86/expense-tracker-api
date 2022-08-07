const express = require('express');
const router = express.Router();
const {
  addTransaction,
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
router.route('/:id/add_transaction').post(addTransaction);

module.exports = router;
