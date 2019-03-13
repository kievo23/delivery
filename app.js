var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');

var passport = require('./config/auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var branchesRouter = require('./routes/branches');
var itemsRouter = require('./routes/items');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// error handler
app.use(function( req, res, next) {
  var loggedin = false;
  if(req.user){
    loggedin = true;
  }

  // set locals, only providing error in development
  res.locals.success_msg = req.flash('success_msg') || null;
  res.locals.error_msg = req.flash('error_msg') || null;
  res.locals.error = req.flash('error') || null;
  //res.locals.message = err.message;
  res.locals.user = req.user || {};
  res.locals.loggedin = loggedin;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("MIDDLEWARE IS WORKING!!!");
  // render the error page
  //res.status(err.status || 500);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/branches', branchesRouter);
app.use('/items', itemsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
