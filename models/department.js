// Department.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Department = sequelize.define('Department', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Department;
