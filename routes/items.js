var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const dateFormat = require('dateformat');
const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const now = new Date();
const Branch = require('../models/Branches');
const User = require('../models/Users');
const Item = require('../models/Items');
const Route = require('../models/Routes');
const Category = require('../models/Category');
const Vehicle = require('../models/Vehicles');

const role = require('../config/role');

/* GET home page. */
router.get('/',role.manager, function(req, res, next) {
  //var items = Item.findAll({include: [{ all: true }]});
  var date = dateFormat(new Date(), "yyyy-mm-dd");
  if(req.user.categoryId == 2){
    var items = Item.findAll({include: [Branch,Vehicle,Route],
      where:{
        managerId: req.user.id
      }});
  }else{
    var items = Item.findAll({include: [Branch,Vehicle,Route]});
  }

  //var couriers = Vehicle.findAll({include: [Branch]});
  var couriers = sequelize.query('SELECT vehicles.*,round(compute.capacity/ vehicles.size * 100) as\
   percentage,branches.name as branchName FROM vehicles \
   LEFT Join (SELECT sum(items.size) as capacity,items.vehicleId FROM items\
    WHERE DATE(assignedOn) = :date GROUP BY items.vehicleId)as compute \
     on compute.vehicleId=vehicles.id LEFT JOIN branches on branches.id=vehicles.id',
    { replacements: { date: date }, type: sequelize.QueryTypes.SELECT }
  )
  Promise.all([items,couriers]).then((data) => {
    //console.log(data[1]);
    res.render('items/index', { title: 'Items', data: data[0], vehicles: data[1] });
  });
});

router.get('/pending',role.auth, function(req, res, next) {
  //var items = Item.findAll({include: [{ all: true }]});
  var date = dateFormat(new Date(), "yyyy-mm-dd");
    if(req.user.categoryId == 2){
      var items = Item.findAll({include: [Branch,Vehicle,Route],
        where:{
          managerId: req.user.id,
          vehicleId: {
            [Op.ne]: null
          },
          delivered: {
            [Op.or]: [null,false]
          }
        }});
    }else{
      var items = Item.findAll({include: [Branch,Vehicle,Route], where: {
          vehicleId: {
            [Op.ne]: null
          },
          delivered: {
            [Op.or]: [null,false]
          }
        }});
    }
  //var couriers = User.findAll({where: {categoryId: 3}});
  var couriers = sequelize.query('SELECT vehicles.*,round(compute.capacity/ vehicles.size * 100) as\
   percentage,branches.name as branchName FROM `vehicles` \
   LEFT Join (SELECT sum(items.size) as capacity,items.vehicleId FROM `items`\
    WHERE DATE(`assignedOn`) = :date GROUP BY items.vehicleId)as compute \
     on compute.vehicleId=vehicles.id LEFT JOIN branches on branches.id=vehicles.id',
    { replacements: { date: date }, type: sequelize.QueryTypes.SELECT }
  );
  Promise.all([items,couriers]).then((data) => {

    //console.log(data);
    res.render('items/index', { title: 'Items', data: data[0], vehicles: data[1] });
  });
});

router.get('/unassigned',role.auth, function(req, res, next) {
  //var items = Item.findAll({include: [{ all: true }]});
  var date = dateFormat(new Date(), "yyyy-mm-dd");
    if(req.user.categoryId == 2){
      var items = Item.findAll({include: [Branch,Vehicle,Route],
        where:{
          managerId: req.user.id,
          vehicleId: null
        }});
    }else{
      var items = Item.findAll({include: [Branch,Vehicle,Route], where: {
          vehicleId: null
        }});
    }
  //var couriers = User.findAll({where: {categoryId: 3}});
  var couriers = sequelize.query('SELECT vehicles.*,round(compute.capacity/ vehicles.size * 100) as\
   percentage,branches.name as branchName FROM `vehicles` \
   LEFT Join (SELECT sum(items.size) as capacity,items.vehicleId FROM `items`\
    WHERE DATE(`assignedOn`) = :date GROUP BY items.vehicleId)as compute \
     on compute.vehicleId=vehicles.id LEFT JOIN branches on branches.id=vehicles.id',
    { replacements: { date: date }, type: sequelize.QueryTypes.SELECT }
  );
  Promise.all([items,couriers]).then((data) => {

    //console.log(data);
    res.render('items/index', { title: 'Items', data: data[0], vehicles: data[1] });
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
  var date = dateFormat(new Date(), "yyyy-mm-dd");
  var couriers = sequelize.query('SELECT vehicles.size,round(compute.capacity/ vehicles.size * 100) as \
   percentage,compute.capacity, branches.name as branchName FROM `vehicles` \
   LEFT Join (SELECT sum(items.size) as capacity,items.vehicleId FROM `items` \
    WHERE DATE(`assignedOn`) = :date GROUP BY items.vehicleId)as compute \
     on compute.vehicleId=vehicles.id LEFT JOIN branches on branches.id=vehicles.id WHERE vehicles.id = :vehicleId',
    { replacements: { date: date, vehicleId: parseInt(req.body.courier) }, type: sequelize.QueryTypes.SELECT }
  );
  var item = Item.findByPk(req.params.id);
  Promise.all([couriers,item]).then((data) => {
      //console.log(data[1].size);
      //console.log(data[0][0].capacity);
      //console.log(data[0][0].size);
      //console.log((parseInt(data[1].size) + parseInt(data[0][0].capacity)) / parseInt(data[0][0].size) * 100);
      if( Math.round((parseInt(data[1].size) + parseInt(data[0][0].capacity)) / parseInt(data[0][0].size) * 100) > 90){
        req.flash('error','Vehicle is at capacity');
        res.redirect('/items');
      }else{
        data[1].vehicleId = parseInt(req.body.courier);
        data[1].assignedOn = now;
        data[1].deliveryTime = req.body.deliveryTime;
        data[1].save(function(err){
            console.log("assigned order");
        });
        req.flash('success','Item assigned successfully');
        res.redirect('/items');
      }
  });
});

router.get('/unassign/:id', role.admin, (req,res) => {
  Item.findByPk(req.params.id).then((data) => {
    //console.log(data);
    data.vehicleId = null;
    data.assignedOn = null;
    data.save(function(err){

    });
    req.flash('warning','Item unassigned successfully');
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
      req.flash('warning','Item marked as not delivered');
      data.delivered = false;
    }else{
      req.flash('success','Item marked as delivered');
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
    size: req.body.size,
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
    size: req.body.size,
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
