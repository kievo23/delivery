const Sequelize = require("sequelize");
const dateFormat = require('dateformat');
const sequelize = require('../config/db');
const Branch = require('./Branches');
const User = require('./Users');
const Route = require('./Routes');

const Item = sequelize.define('items',{
    name: {type: Sequelize.STRING,allowNull: false},
    quantity: Sequelize.STRING,
    productCode: Sequelize.STRING,
    photo: {type: Sequelize.TEXT, allowNull: true},
    price: Sequelize.STRING,
    description: {type: Sequelize.TEXT, allowNull: true, defaultValue: 'coming soon '},
    destCustomerName: Sequelize.STRING,
    destCustomerPhone: Sequelize.STRING,
    destCustomerDest: Sequelize.STRING,
    destCustomerDetails: Sequelize.TEXT,
    delivered: { type: Sequelize.BOOLEAN,defaultValue: false},
    assignedOn: { type: Sequelize.DATEONLY,allowNull: true},
    deliveredOn: { type: Sequelize.DATEONLY,allowNull: true},
    createdAt: Sequelize.DATEONLY,
    updatedAt: Sequelize.DATEONLY
  },{
    getterMethods:{
      created_at: function(){
        return dateFormat(this.createdAt, "mmm dS, yyyy, h:MM:ss TT");
      }
    }
  }
);

Item.belongsTo(Branch, {foreignKey: 'branchId'});
Item.belongsTo(Route, {foreignKey: 'routeId'});
Item.belongsTo(User, {foreignKey: 'courierId', as: 'courier', constraints: false});
Item.belongsTo(User, {foreignKey: 'managerId', as: 'manager', constraints: false});

module.exports = Item;
