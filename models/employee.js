// Employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Role = require('./role');

const Employee = sequelize.define('Employee', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Employee.belongsTo(Role, { as: 'role' });
Employee.belongsTo(Employee, { as: 'manager', foreignKey: 'managerId' });

module.exports = Employee;
