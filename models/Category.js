const Sequelize = require("sequelize");
const connection = require('../config/db');

const Category = connection.define('categories',{
    name:Sequelize.STRING
  },{
  timestamps: true // timestamps will now be true
  }
);

module.exports = Category;
