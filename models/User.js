const mongoose = require('mongoose');
const Bank = require('./Bank');
const slugify = require('slugify');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    maxlength: [16, 'Username must be less than 16 characters']
  },
  userType: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: 'User type must be either admin or user'
    },
    default: 'user'
  },
  firstName: {
    type: String,
    required: [true, 'Please add a name'],
    maxlength: [50, 'First name can not be more than 50 characters'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please add a name'],
    maxlength: [50, 'Last name can not be more than 50 characters'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // ANCHOR -> This is to prevent the password from being returned in the response
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// UserSchema.pre('save', function (next) {
//   this.slug = slugify(this.username, { lower: true });
//   next();
// });

UserSchema.post('save', function (user) {
  let bank = new Bank();
  bank.totalBalance = 69;
  bank.user = user._id.toString();
  bank.save();
});

module.exports = mongoose.model('User', UserSchema);
