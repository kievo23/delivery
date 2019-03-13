var express = require('express');
var router = express.Router();
const Branch = require('../models/Branches');
const User = require('../models/Users');
const Item = require('../models/Items');
const role = require('../config/role');

/* GET home page. */
router.get('/', function(req, res, next) {
  Branch.build({
    name: "t mall",
    location: "langata",
    contacts: "0710345130",
    details: "bla bla"
  });
  var branches = Branch.findAll().then((data) => {
    console.log(data);
    res.render('branches/index', { title: 'Delivery', data: data });
  });
});

router.get('/create',role.admin, function(req, res, next) {
  res.render('branches/create', { title: 'Add Branch' });
});

router.post('/create',role.admin, function(req, res, next) {
  Branch.create({
    name: req.body.name,
    location: req.body.location,
    contacts: req.body.contacts,
    details: req.body.details
  }).then((rst) => {
    res.redirect('/branches');
  }).catch((x) => {
    res.redirect('/');
  })
});

router.get('/edit/:id',role.admin, (req, res) => {
  Branch.findByPk(req.params.id).then((data)=> {
    res.render('branches/edit',{data: data, title: "edit "+ data.name})
  })
});

router.post('/update/:id',role.admin, (req, res, next) => {
  Branch.update({
    name: req.body.name,
    location: req.body.location,
    contacts: req.body.contacts,
    details: req.body.details
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
