var express = require('express');
var router = express.Router();
const Branch = require('../models/Branches');
const User = require('../models/Users');
const Item = require('../models/Items');
const Route = require('../models/Routes');
const role = require('../config/role');

/* GET home page. */
router.get('/',role.admin, function(req, res, next) {
  Route.build({
    name: "t mall",
    details: "bla bla"
  });
  var branches = Route.findAll().then((data) => {
    console.log(data);
    res.render('routes/index', { title: 'Routes', data: data });
  });
});

router.get('/create',role.admin, function(req, res, next) {
  res.render('routes/create', { title: 'Add Branch' });
});

router.post('/create',role.admin, function(req, res, next) {
  Route.create({
    name: req.body.name,
    details: req.body.details
  }).then((rst) => {
    res.redirect('/routes');
  }).catch((x) => {
    res.redirect('/');
  })
});

router.get('/edit/:id',role.admin, (req, res) => {
  Route.findByPk(req.params.id).then((data)=> {
    res.render('routes/edit',{data: data, title: "edit "+ data.name})
  })
});

router.post('/update/:id',role.admin, (req, res, next) => {
  Route.update({
    name: req.body.name,
    details: req.body.details
  },{
    where: {
      id: req.params.id
    }
  })
  .then((data)=> {
    res.redirect('/routes')
  })
  .catch(next)
});

module.exports = router;
