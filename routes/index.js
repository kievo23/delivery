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
const Category = require('../models/Category');

/* GET home page. */
router.get('/', role.auth, function(req, res, next) {
  //console.log(res.locals.loggedin);
  var branches = Branch.findAll();
  var managers = User.findAll({include: [Branch,Category],where: {categoryId: 2}});
  var drivers = User.findAll({include: [Branch,Category],where: {categoryId: 3}});
  Promise.all([managers,drivers,branches]).then((data) => {
    data[0].forEach((d) => {
      //d.date = dateFormat(d.createdAt, "mmm dS, yyyy, h:MM:ss TT");
    });
    res.render('index', { title: 'Items', managers: data[0],drivers: data[1],branches: data[2] });
  });
});

router.post('/reports/branches',role.admin, function(req, res, next) {
  var date = dateFormat(req.body.date, "yyyy-mm-dd");
  var items = Item.findAll({
    include: [Branch,{
          model: User,
          as: 'courier'
      }],
    where: sequelize.where(sequelize.fn('date', sequelize.col('items.createdAt')), '=', date),
    where: {
      branchId: req.body.branch
    }
  });
  var branch = Branch.findByPk(req.body.branch);
  Promise.all([items,branch]).then((data)=> {
    res.render('reports/branches',{data: data[0], head: data[1], subtitle: "Branch"})
  });
});

router.post('/reports/managers',role.admin, function(req, res, next) {
  var date = dateFormat(req.body.date, "yyyy-mm-dd");
  var items = Item.findAll({
    include: [Branch,{
          model: User,
          as: 'courier'
      }],
    where: sequelize.where(sequelize.fn('date', sequelize.col('items.createdAt')), '=', date),
    where: {
      managerId: req.body.manager
    }
  });
  var user = User.findByPk(req.body.manager);
  Promise.all([items,user]).then((data)=> {
    res.render('reports/branches',{data: data[0], head: data[1], subtitle: "Manager"})
  });
});

router.post('/reports/couriers',role.admin, function(req, res, next) {
  var date = dateFormat(req.body.date, "yyyy-mm-dd");
  var items = Item.findAll({
    include: [Branch,{
          model: User,
          as: 'courier'
      }],
    where: sequelize.where(sequelize.fn('date', sequelize.col('items.assignedOn')), '=', date),
    where: {
      courierId: req.body.courier
    }
  });
  var user = User.findByPk(req.body.courier);
  Promise.all([items,user]).then((data)=> {
    res.render('reports/branches',{data: data[0], head: data[1], subtitle: "Courier"})
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

module.exports = router;
