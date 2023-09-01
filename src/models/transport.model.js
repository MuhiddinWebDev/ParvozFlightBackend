const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class TransportModel extends Model {}

TransportModel.init({
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
    icon: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: ""
    },
    link: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: ""
    },
}, {
  sequelize,
  modelName: 'TransportModel',
  tableName: 'transport',
  timestamps: true,
  paranoid: true,
});

module.exports = TransportModel;