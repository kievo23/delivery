const Sequelize = require("sequelize");
const sequelize = require('../config/db');

const Type = sequelize.define('type',{
    name:Sequelize.STRING
  },{
  timestamps: true // timestamps will now be true
  }
);


module.exports = Type;
