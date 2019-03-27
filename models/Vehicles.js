const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const Branch = require('./Branches');

const Vehicle = sequelize.define('vehicles',{
    name:Sequelize.STRING,
    registration: Sequelize.STRING,
    size: Sequelize.STRING,
    details: Sequelize.TEXT
  },{
  timestamps: true // timestamps will now be true
  }
);

//User.belongsTo(Company, {foreignKey: 'fk_company'});
Vehicle.belongsTo(Branch, {foreignKey: 'branchId'});

module.exports = Vehicle;
