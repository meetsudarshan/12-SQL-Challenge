// Role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Department = require('./department');

const Role = sequelize.define('Role', {
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Department,
      key: 'id',
    },
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

Role.belongsTo(Department, { foreignKey: 'departmentId', as: 'Department' });

module.exports = Role;
