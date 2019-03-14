var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const dateFormat = require('dateformat');
const Sequelize = require("sequelize");
const now = new Date();
const Branch = require('../models/Branches');
const User = require('../models/Users');
const Item = require('../models/Items');
const Route = require('../models/Routes');
const Category = require('../models/Category');

const role = require('../config/role');

/* GET home page. */
router.get('/',role.manager, function(req, res, next) {
  //var items = Item.findAll({include: [{ all: true }]});
  if(req.user.categoryId == 2){
    var items = Item.findAll({include: [Branch,{
          model: User,
          as: 'courier'
      }],
      where:{
        managerId: req.user.id
      }});
  }else{
    var items = Item.findAll({include: [Branch,{
          model: User,
          as: 'courier'
      }]});
  }

  var couriers = User.findAll({where: {categoryId: 3}});
  Promise.all([items,couriers]).then((data) => {
    //console.log(res.locals);
    res.render('items/index', { title: 'Items', data: data[0], couriers: data[1] });
  });
});

router.get('/unassigned',role.auth, function(req, res, next) {
  //var items = Item.findAll({include: [{ all: true }]});
  var items = Item.findAll({include: [Branch,{
        model: User,
        as: 'courier'
    }], where: {
      courierId: null
    }});
  var couriers = User.findAll({where: {categoryId: 3}});
  Promise.all([items,couriers]).then((data) => {
    console.log(data);
    data[0].forEach((d) => {
      d.date = dateFormat(d.createdAt, "mmm dS, yyyy, h:MM:ss TT");
    });
    //console.log(data);
    res.render('items/index', { title: 'Items', data: data[0], couriers: data[1] });
  });
});

router.get('/create',role.manager, function(req, res, next) {
  var branches = Branch.findAll();
  var categories = Category.findAll();
  var routes = Route.findAll();
  Promise.all([branches,categories,routes]).then((data) => {
    res.render('items/create', { title: 'Add User', branches: data[0], categories: data[1],routes: data[2] });
  });
});

router.post('/assign/:id', role.admin, (req,res) => {
  Item.findByPk(req.params.id).then((data) => {
    //console.log(data);
    data.courierId = parseInt(req.body.courier);
    data.assignedOn = now;
    data.save(function(err){

    });
    res.redirect('/items');
  });
});

router.get('/delivered/:id',role.manager, (req,res) => {
  var promise = null;
  if(req.user.role == 1){
    promise = Item.findByPk(req.params.id);
  }else{
    promise = Item.findOne({where: {id: req.params.id, managerId: req.user.id}});
  }
  promise.then(data => {
    //console.log(data);
    if(data.delivered == true){
      data.delivered = false;
    }else{
      data.delivered = true;
    }
    data.deliveredOn = now;
    data.save(function(err){

    });
    res.redirect('/items');
  });
});

router.post('/create',role.manager, function(req, res, next) {
  let data = {
    name: req.body.name,
    quantity: req.body.quantity,
    productCode: req.body.productcode,
    description: req.body.description,
    price: req.body.price,
    destCustomerName: req.body.custName,
    destCustomerPhone: req.body.custPhone,
    destCustomerDest: req.body.custDest,
    branchId: req.body.branch,
    managerId: req.user.id,
    routeId: req.body.route,
    destCustomerDetails: req.body.custdescription,
    //managerId: req.body.
  }
  if(req.body.route != ''){
    data.routeId = req.body.route;
  }
  Item.create(data).then((rst) => {
    res.redirect('/items');
  }).catch((x) => {
    console.log(x);
    res.redirect('/');
  })
});

router.get('/edit/:id',role.manager, (req, res) => {
  var item = Item.findByPk(req.params.id , {include: [Branch,Route]});
  var branches = Branch.findAll();
  var routes = Route.findAll();
  Promise.all([item,branches,routes]).then((data)=> {
    res.render('items/edit',{item: data[0], branches:data[1], routes: data[2],title: "edit "+ data[0].name})
  });
});

router.post('/update/:id',role.manager, (req, res, next) => {
  let data = {
    name: req.body.name,
    location: req.body.location,
    contacts: req.body.contacts,
    categoryId: req.body.category,
    branchId: req.body.branch,
    email: req.body.email,
    routeId: req.body.route,
    managerId: req.user.id,
    description: req.body.description
  }
  if(req.body.route != ''){
    data.routeId = req.body.route;
  }
  Item.update(data,{
    where: {
      id: req.params.id
    }
  })
  .then((data) => {
    res.redirect('/items')
  })
  .catch(next)
});

module.exports = router;
