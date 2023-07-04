// Role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Department = require('./department');

const Role = sequelize.define('Role', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

Role.belongsTo(Department);

module.exports = Role;
