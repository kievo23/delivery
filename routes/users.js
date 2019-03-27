var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const Branch = require('../models/Branches');
const User = require('../models/Users');
const Item = require('../models/Items');
const Category = require('../models/Category');
const role = require('../config/role');

/* GET home page. */
router.get('/',role.admin, function(req, res, next) {
  var users = User.findAll({include: [Branch,Category]}).then((data) => {
    //console.log(data);
    res.render('users/index', { title: 'Users', data: data });
  });
});

router.get('/managers',role.manager, function(req, res, next) {
  var users = User.findAll({include: [Branch,Category],where: {categoryId: 2}}).then((data) => {
    //console.log(data);
    res.render('users/index', { title: 'Users', data: data });
  });
});

router.get('/couriers',role.manager, function(req, res, next) {
  var users = User.findAll({include: [Branch,Category],where: {categoryId: 3}}).then((data) => {
    //console.log(data);
    res.render('users/index', { title: 'Users', data: data });
  });
});

router.get('/create',role.admin, function(req, res, next) {
  var branches = Branch.findAll();
  var categories = Category.findAll();
  Promise.all([branches,categories]).then((data) => {
    res.render('users/create', { title: 'Add User', branches: data[0], categories: data[1] });
  });
});

router.post('/create',role.admin, function(req, res, next) {
  //console.log(req.body);
  var data = {
    name: req.body.name,
    location: req.body.location,
    contacts: req.body.contacts,
    categoryId: req.body.category,
    email: req.body.email,
    password: req.body.password,
    description: req.body.description
  }
  if(req.body.branch != ''){
    data.branchId = req.body.branch;
  }

  User.create(data).then((rst) => {
    req.flash('success','User Created Successfully');
    res.redirect('/users');
  }).catch((x) => {
    console.log(x);
    res.redirect('/');
  })
});

router.get('/edit/:id',role.admin, (req, res) => {
  var user = User.findByPk(req.params.id,{include: [Branch,Category]});
  var branches = Branch.findAll();
  var categories = Category.findAll();
  Promise.all([user,branches,categories]).then((data)=> {
    res.render('users/edit',{user: data[0], branches:data[1], categories: data[2], title: "edit "+ data[0].name})
  });
});

router.post('/update/:id',role.admin, (req, res, next) => {
  var data = {
    name: req.body.name,
    location: req.body.location,
    contacts: req.body.contacts,
    categoryId: req.body.category,
    email: req.body.email,
    password: req.body.password,
    description: req.body.description
  }
  if(req.body.branch != ''){
    data.branchId = req.body.branch;
  }
  User.update(data,{
    where: {
      id: req.params.id
    }
  })
  .then((data)=> {
    req.flash('success','User Edited successfully');
    res.redirect('/users')
  })
  .catch(next)
});

module.exports = router;
