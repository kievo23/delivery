var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const Branch = require('../models/Branches');
const User = require('../models/Users');
const Item = require('../models/Items');
const Category = require('../models/Category');
const role = require('../config/role');
const Vehicle = require('../models/Vehicles');

/* GET home page. */
router.get('/',role.admin, function(req, res, next) {
  Vehicle.findAll({include: [Branch]}).then((data) => {
    //console.log(data);
    res.render('vehicles/index', { title: 'Vehicles', data: data });
  });
});

router.get('/create',role.admin, function(req, res, next) {
  var branches = Branch.findAll();
  Promise.all([branches]).then((data) => {
    res.render('vehicles/create', { title: 'Add Vehicle', branches: data[0] });
  });
});

router.post('/create',role.admin, function(req, res, next) {
  //console.log(req.body);
  var data = {
    name: req.body.name,
    registration: req.body.registration,
    size: req.body.size,
    details: req.body.details
  }
  if(req.body.branch != ''){
    data.branchId = req.body.branch;
  }

  Vehicle.create(data).then((rst) => {
    req.flash('success','Vehicle Created Successfully');
    res.redirect('/vehicles');
  }).catch((x) => {
    console.log(x);
    res.redirect('/');
  })
});

router.get('/edit/:id',role.admin, (req, res) => {
  var branches = Branch.findAll();
  var vehicle = Vehicle.findByPk(req.params.id,{include: [Branch]});
  Promise.all([branches,vehicle]).then((data)=> {
    res.render('vehicles/edit',{ branches:data[0], title: "edit "+ data[0].name, vehicle: data[1]})
  });
});

router.post('/update/:id',role.admin, (req, res, next) => {
  var data = {
    name: req.body.name,
    registration: req.body.registration,
    size: req.body.size,
    details: req.body.details
  }
  if(req.body.branch != ''){
    data.branchId = req.body.branch;
  }
  Vehicle.update(data,{
    where: {
      id: req.params.id
    }
  })
  .then((data)=> {
    req.flash('success','Vehicle Updated Successfully');
    res.redirect('/vehicles')
  })
  .catch(next)
});

module.exports = router;
