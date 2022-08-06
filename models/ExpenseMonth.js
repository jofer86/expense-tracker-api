// Bank model
const mongoose = require('mongoose');

const ExpenseMonthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [50, 'Name must be less than 50 characters'],
    trim: true
  },
  totalBalance: {
    type: Number,
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

module.exports = mongoose.model('ExpenseMonth', ExpenseMonthSchema);
