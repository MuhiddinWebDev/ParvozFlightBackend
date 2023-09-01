const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const OrderStepsFieldsTableModel = require('../models/orderStepsFieldsTable.model');
class OrderStepsTableModel extends Model {}

OrderStepsTableModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
      type: DataTypes.VIRTUAL,
      allowNull: true
    },
    title_uz: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    title_ru: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    title_ka: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    promocode: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ''
    },
    check_promocode: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    active_promocode: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('waiting', 'active', 'checking', 'done'),
      allowNull: true,
      defaultValue: 'waiting'
    },
    comment: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
    },
    comment_uz: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comment_ru: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comment_ka: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    action: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 'true'
    },
    action_title: {
      type: DataTypes.VIRTUAL(256),
      allowNull: true,
      defaultValue: ""
    },
    action_title_uz: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: ""
    },
    action_title_ru: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: ""
    },
    action_title_ka: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 'false'
    },
}, {
  sequelize,
  modelName: 'OrderStepsTableModel',
  tableName: 'order_steps_table',
  timestamps: true,
  paranoid: true,
});


OrderStepsTableModel.hasMany(OrderStepsFieldsTableModel, { as: 'order_steps_fields_table', foreignKey: 'steps_parent_id' })


module.exports = OrderStepsTableModel;