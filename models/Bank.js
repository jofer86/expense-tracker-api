// Bank model
const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
  totalBalance: {
    type: Number,
    required: [true, 'Total balance is required'],
    default: 0,
    trim: true
  },
  totalIncome: {
    type: Number,
    default: 0,
    trim: true
  },
  totalExpense: {
    type: Number,
    default: 0,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Bank', BankSchema);
