const Sequelize = require("sequelize");
const sequelize = require('../config/db');

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


module.exports = Branch;
