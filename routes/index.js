var express = require('express');
var router = express.Router();
const dateFormat = require('dateformat');
const moment = require('moment');
const sequelize = require("sequelize");
const Op = sequelize.Op;

//CONFIGS
const connection = require('../config/db');
const passport = require('../config/auth');
const role = require('../config/role');

//MODELS
const Branch = require('../models/Branches');
const User = require('../models/Users');
const Item = require('../models/Items');
const Route = require('../models/Routes');
const Category = require('../models/Category');

/* GET home page. */
router.get('/', role.auth, function(req, res, next) {
  //console.log(res.locals.loggedin);

  var branches = Branch.findAll();
  var routes = Route.findAll();
  var managers = User.findAll({include: [Branch,Category],where: {categoryId: 2}});
  var drivers = User.findAll({include: [Branch,Category],where: {categoryId: 3}});
  Promise.all([managers,drivers,branches,routes]).then((data) => {
    res.render('index', { title: 'Items', managers: data[0],drivers: data[1],branches: data[2],routes:data[3] });
  });
});


router.post('/reports/routes',role.admin, function(req, res, next) {
  var date = dateFormat(req.body.date, "yyyy-mm-dd");

  var items = Item.findAll({
    include: [Branch,{
          model: User,
          as: 'courier'
      }],where: {
      routeId: req.body.route,
      createdAt: new Date(date)
    }
  });
  var route = Route.findByPk(req.body.route);
  var couriers = User.findAll({include: [Branch,Category],where: {categoryId: 3}});
  Promise.all([items,route,couriers]).then((data)=> {
    res.render('reports/branches',{data: data[0], head: data[1], subtitle: "Route",couriers:data[2]})
  });
});


router.post('/reports/branches',role.admin, function(req, res, next) {
  var date = dateFormat(req.body.date, "yyyy-mm-dd");

  var items = Item.findAll({
    include: [Branch,{
          model: User,
          as: 'courier'
      }],where: {
      branchId: req.body.branch,
      createdAt: new Date(date)
    }
  });
  var branch = Branch.findByPk(req.body.branch);
  var couriers = User.findAll({include: [Branch,Category],where: {categoryId: 3}});
  Promise.all([items,branch,couriers]).then((data)=> {
    res.render('reports/branches',{data: data[0], head: data[1], subtitle: "Branch",couriers: data[2]})
  });
});

router.post('/reports/managers',role.admin, function(req, res, next) {
  var date = dateFormat(req.body.date, "yyyy-mm-dd");
  console.log(req.body.date);
  var items = Item.findAll({
    include: [Branch,{
          model: User,
          as: 'courier'
      }],
    where: {
      managerId: req.body.manager,
      createdAt: new Date(date)
    }
  });
  var user = User.findByPk(req.body.manager);
  var couriers = User.findAll({include: [Branch,Category],where: {categoryId: 3}});
  Promise.all([items,user,couriers]).then((data)=> {
    res.render('reports/branches',{data: data[0], head: data[1], subtitle: "Manager",couriers: data[2]})
  });
});

router.post('/reports/couriers',role.admin, function(req, res, next) {
  var date = dateFormat(req.body.date, "yyyy-mm-dd");
  var items = Item.findAll({
    include: [Branch,{
          model: User,
          as: 'courier'
      }],
    where: {
      courierId: req.body.courier,
      createdAt: new Date(date)
    }
  });
  var user = User.findByPk(req.body.courier);
  var couriers = User.findAll({include: [Branch,Category],where: {categoryId: 3}});
  Promise.all([items,user,couriers]).then((data)=> {
    res.render('reports/branches',{data: data[0], head: data[1], subtitle: "Courier", couriers: data[2]})
  });
});

//AUTH


router.post('/login', passport.authenticate('local', {failureRedirect: '/login',
                                   failureFlash: true })
  , function(req, res){
    ssn = req.session;
    //console.log(req.session.user);
    if(ssn.returnUrl){
      res.redirect(ssn.returnUrl);
    }
    res.redirect('/');
});

router.get('/login', function (req, res) {
  res.render('login', { title: "Sign in" });
});

router.get('/logout', role.auth, function(req, res){
  //req.logout();
  req.session.destroy(function(err) {
  // cannot access session here
  res.redirect("/login");
  });
});

router.get('/createData', (req, res) => {

  Category.create({
    id: 1,
    name: "Admin"
  });

  Category.create({
    id: 2,
    name: "Manager"
  });

  Category.create({
    id: 3,
    name: "Driver"
  });

  User.create({
    id: 1,
    name: 'admin',
    location: 'roysambu',
    contacts: '0710345130',
    categoryId: 1,
    email: 'admin@gmail.com',
    password: '1234',
    description: 'kelvin chege'
  });
})

module.exports = router;
