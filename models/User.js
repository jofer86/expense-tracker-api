const mongoose = require('mongoose');
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

// Create bootcamp slug from the name
UserSchema.pre('save', function (next) {
  console.log('in pre', this);
  this.slug = slugify(this.username, { lower: true });
  console.log(this.slug);
  next();
});

module.exports = mongoose.model('User', UserSchema);
