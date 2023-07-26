const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const RoomTableModel = require('./roomTable.model');
class RoomModel extends Model {}

RoomModel.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name_uz: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    name_ru: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    name_ka: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
}, {
  sequelize,
  modelName: 'RoomModel',
  tableName: 'room',
  timestamps: true,
  paranoid: true,
});


RoomModel.hasMany(RoomTableModel , { as: 'room_table', foreignKey: 'parent_id' });

module.exports = RoomModel;