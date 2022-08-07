const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error.middleware');
const connectDB = require('./config/db.config');
// Env vars
dotenv.config({ path: './config/config.env' });
// DB Connection
connectDB();
// Routes
const users = require('./routes/users.routes');
const expenseMonths = require('./routes/expense-months.routes');

const app = express();
app.use(express.json());
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/users', users);
app.use('/api/v1/users/:id/expense_months', expenseMonths);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.cyan.bold)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close server exit process
  server.close(() => process.exit(1));
});
