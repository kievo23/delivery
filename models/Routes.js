const Sequelize = require("sequelize");
const sequelize = require('../config/db');

const Route = sequelize.define('routes',{
    name:Sequelize.STRING,
    details: Sequelize.TEXT
  },{
  timestamps: true // timestamps will now be true
  }
);

//User.belongsTo(Company, {foreignKey: 'fk_company'});


module.exports = Route;
