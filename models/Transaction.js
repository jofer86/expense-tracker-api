const mongoose = require('mongoose');
const slugify = require('slugify');

const TransactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [50, 'Title must be less than 50 characters'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  transactionType: {
    type: String,
    enum: {
      values: ['income', 'expense'],
      message: 'Transaction type must be either income or expense'
    }
  },
  espenseMonth: {
    type: mongoose.Schema.ObjectId,
    ref: 'ExpenseMonth'
  },
  bank: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bank'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
