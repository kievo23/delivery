const Sequelize = require("sequelize");
const dateFormat = require('dateformat');
const sequelize = require('../config/db');
const Branch = require('./Branches');
const User = require('./Users');

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
    assignedOn: { type: Sequelize.DATE,allowNull: true},
    deliveredOn: { type: Sequelize.DATE,allowNull: true}
  },{
    timestamps: true, // timestamps will now be true
    getterMethods:{
      created_at: function(){
        return dateFormat(this.createdAt, "mmm dS, yyyy, h:MM:ss TT");
      }
    }
  }
);

Item.belongsTo(Branch, {foreignKey: 'branchId'});
Item.belongsTo(User, {foreignKey: 'courierId', as: 'courier', constraints: false});
Item.belongsTo(User, {foreignKey: 'managerId', as: 'manager', constraints: false});

module.exports = Item;
