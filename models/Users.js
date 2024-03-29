const Sequelize = require("sequelize");
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const Branch = require('./Branches');
const Category = require('./Category');

const User = sequelize.define('users',{
    name: {type: Sequelize.STRING,allowNull: false},
    location: Sequelize.STRING,
    contacts: Sequelize.STRING,
    email: {type: Sequelize.STRING, allowNull: true, unique: true},
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: ' coming soon '
    },
    password: Sequelize.STRING,
    passwordChanged: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0
    }
  },{
  timestamps: true, // timestamps will now be true
  hooks: {
    beforeCreate: (user, options) => {
      user.password = bcrypt.hashSync(user.password, 10);
    },
    beforeUpdate: (user, options) => {
      user.password = bcrypt.hashSync(user.password, 10);
    }
  }
  }
);

User.belongsTo(Branch, {foreignKey: 'branchId'});
User.belongsTo(Category, {foreignKey: 'categoryId'});



module.exports = User;
