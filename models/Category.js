const Sequelize = require("sequelize");
const connection = require('../config/db');

const Category = connection.define('categories',{
    name:Sequelize.STRING
  },{
  timestamps: true // timestamps will now be true
  }
);

connection.sync({
  //force: true
}).then(function(){
/*
  Category.create({
    name: "Admin"
  }).then((rst) => {
    console.log(rst);
  }).catch((x) => {
    console.log(x);
  });

  Category.create({
    name: "Manager"
  }).then((rst) => {
    console.log(rst);
  }).catch((x) => {
    console.log(x);
  });

  Category.create({
    name: "Driver"
  }).then((rst) => {
    console.log(rst);
  }).catch((x) => {
    console.log(x);
  });
*/
});

module.exports = Category;
