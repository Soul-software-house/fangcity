const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

//const generate_image = require('./lib/generate_image/generate_image');

/*
// connect to database
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to database');
});*/

let app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/generateimage', require('./routes/generateimage'));
app.use('/api/uploadimage', require('./routes/uploadimage'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

// handle uncaught exceptions
process
  .on('uncaughtException', (err) => {
    console.log(err);
  })
  .on('unhandledRejection', (err) => {
    console.log(err);
  });

app.listen(process.env.PORT || 3001, () => {
  console.log(`[INFO] Server started on port ${process.env.PORT || 3001}`);
});
