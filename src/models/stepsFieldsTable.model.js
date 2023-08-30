const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class StepsFieldsTableModel extends Model {}

StepsFieldsTableModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    steps_parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
      type: DataTypes.VIRTUAL,
      allowNull: true
    },
    title_uz: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: ""
    },
    title_ru: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: ""
    },
    title_ka: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: ""
    },
    type: {
      type: DataTypes.ENUM('image', 'file', 'number','text','date'),
      allowNull: true,
      defaultValue: 'text'
    },
    value: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    column_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
}, {
  sequelize,
  modelName: 'StepsFieldsTableModel',
  tableName: 'steps_fields_table',
  timestamps: true,
  paranoid: true,
});

module.exports = StepsFieldsTableModel;