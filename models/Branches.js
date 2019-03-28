const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const Region = require('./Regions');
const Type = require('./Type');

const Branch = sequelize.define('branches',{
    name:Sequelize.STRING,
    location: Sequelize.STRING,
    contacts: Sequelize.STRING,
    details: Sequelize.TEXT
  },{
  timestamps: true // timestamps will now be true
  }
);

//User.belongsTo(Company, {foreignKey: 'fk_company'});
Branch.belongsTo(Region, {foreignKey: 'regionId'});
Branch.belongsTo(Type, {foreignKey: 'typeId'});

module.exports = Branch;
