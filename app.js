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
var vehiclesRouter = require('./routes/vehicles');

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
  var loggedin = false;
  // set locals, only providing error in development
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.msgerror = req.flash('error') || null;
  res.locals.msgdefault = req.flash('default') || null;
  res.locals.msgsuccess = req.flash('success') || null;
  res.locals.msgprimary = req.flash('primary') || null;
  res.locals.msginfo = req.flash('info') || null;
  res.locals.msgwarning = req.flash('warning') || null;
  //console.log(res.locals.error);
  if(req.user){
    loggedin = true;
    let unassigned;
    let totalOrders;
    let deliveredOrders;
    if(req.user.categoryId == 1){
      unassigned = Item.count({ where: { vehicleId: null}});
      totalOrders = Item.count({});
      deliveredOrders = Item.count({where: { delivered: true}});
    }else{
      unassigned = Item.count({ where: { vehicleId: null,managerId: req.user.branchId}});
      totalOrders = Item.count({where: { branchId: req.user.branchId}});
      deliveredOrders = Item.count({where: { delivered: true,managerId: req.user.branchId}});
    }
    let couriers = User.count({where: {categoryId: 3}});
    let managers = User.count({where: {categoryId: 2}});

    let routes = Route.count({});
    let branches = Branch.count({});
    Promise.all([couriers,managers,unassigned,totalOrders,deliveredOrders,routes,branches]).then((data) => {
      res.locals.allcouriers = data[0];
      res.locals.allmanagers = data[1];
      res.locals.unassigned = data[2];
      res.locals.totalOrders = data[3];
      res.locals.deliveredOrders = data[4];
      res.locals.allroutes = data[5];
      res.locals.allbranches = data[6];
      //res.locals.message = err.message;
      res.locals.user = req.user || {};
      res.locals.loggedin = loggedin;
      //res.locals.error = req.app.get('env') === 'development' ? err : {};
      //console.log("MIDDLEWARE IS WORKING!!!");
      // render the error page
      //res.status(err.status || 500);
    });
  }else{
    //res.locals.message = err.message;
    res.locals.user = req.user || {};
    res.locals.loggedin = loggedin;
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/branches', branchesRouter);
app.use('/items', itemsRouter);
app.use('/routes', routesRouter);
app.use('/vehicles', vehiclesRouter);

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
