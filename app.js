var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');

var passport = require('./config/auth');

//MODELS
const Branch = require('./models/Branches');
const User = require('./models/Users');
const Item = require('./models/Items');
const Route = require('./models/Routes');
const Category = require('./models/Category');

//Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var branchesRouter = require('./routes/branches');
var itemsRouter = require('./routes/items');
var routesRouter = require('./routes/routes');

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


// MIDDLEWARE
app.use(function( req, res, next) {
  let couriers = User.count({where: {categoryId: 3}});
  let managers = User.count({where: {categoryId: 2}});
  let unassigned = Item.count({ where: { courierId: null}});
  let totalOrders = Item.count({});
  let deliveredOrders = Item.count({where: { delivered: true}});
  let routes = Route.count({});
  let branches = Branch.count({});
  Promise.all([couriers,managers,unassigned,totalOrders,deliveredOrders,routes,branches]).then((data) => {
    var loggedin = false;
    if(req.user){
      loggedin = true;
    }

    res.locals.allcouriers = data[0];
    res.locals.allmanagers = data[1];
    res.locals.unassigned = data[2];
    res.locals.totalOrders = data[3];
    res.locals.deliveredOrders = data[4];
    res.locals.allroutes = data[5];
    res.locals.allbranches = data[6];

    // set locals, only providing error in development
    res.locals.success_msg = req.flash('success_msg') || null;
    res.locals.error_msg = req.flash('error_msg') || null;
    res.locals.error = req.flash('error') || null;
    //res.locals.message = err.message;
    res.locals.user = req.user || {};
    res.locals.loggedin = loggedin;
    //res.locals.error = req.app.get('env') === 'development' ? err : {};
    //console.log("MIDDLEWARE IS WORKING!!!");
    // render the error page
    //res.status(err.status || 500);
    next();
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/branches', branchesRouter);
app.use('/items', itemsRouter);
app.use('/routes', routesRouter);

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
