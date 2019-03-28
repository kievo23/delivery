const Sequelize = require("sequelize");
const sequelize = require('../config/db');

const Regions = sequelize.define('region',{
    name:Sequelize.STRING
  },{
  timestamps: true // timestamps will now be true
  }
);


module.exports = Regions;
