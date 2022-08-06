const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  let db = process.env.MONGO_URI;
  try {
    const connect = await mongoose.connect(`${db}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB connected on: ${connect.connection.host}`.magenta);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
