var express = require('express');
var router = express.Router();
const Branch = require('../models/Branches');
const User = require('../models/Users');
const Item = require('../models/Items');
const Regions = require('../models/Regions');
const Type = require('../models/Type');
const role = require('../config/role');

/* GET home page. */
router.get('/', role.admin, function(req, res, next) {
  Branch.build({
    name: "t mall",
    location: "langata",
    contacts: "0710345130",
    details: "bla bla"
  });
  var branches = Branch.findAll({include: [Type,Regions]}).then((data) => {
    //console.log(data);
    res.render('branches/index', { title: 'Delivery', data: data });
  });
});

router.get('/create',role.admin, function(req, res, next) {
  var regions = Regions.findAll();
  var types = Type.findAll();
  Promise.all([regions,types]).then((data) => {
    res.render('branches/create', { title: 'Add User', regions: data[0], types: data[1] });
  });
  //res.render('branches/create', { title: 'Add Branch' });
});

router.post('/create',role.admin, function(req, res, next) {
  Branch.create({
    name: req.body.name,
    location: req.body.location,
    contacts: req.body.contacts,
    details: req.body.details,
    regionId: req.body.regionId,
    typeId: req.body.typeId
  }).then((rst) => {
    res.redirect('/branches');
  }).catch((x) => {
    res.redirect('/');
  })
});

router.get('/edit/:id',role.admin, (req, res) => {
  var regions = Regions.findAll();
  var types = Type.findAll();
  var branch = Branch.findByPk(req.params.id,{include: [Type,Regions]});
  Promise.all([regions,types,branch]).then((data) => {
    res.render('branches/edit', { title: "edit "+ data[2].name, regions: data[0], types: data[1], data: data[2] });
  });
});

router.post('/update/:id',role.admin, (req, res, next) => {
  Branch.update({
    name: req.body.name,
    location: req.body.location,
    contacts: req.body.contacts,
    details: req.body.details,
    regionId: req.body.regionId,
    typeId: req.body.typeId
  },{
    where: {
      id: req.params.id
    }
  })
  .then((data)=> {
    res.redirect('/branches')
  })
  .catch(next)
});

module.exports = router;
