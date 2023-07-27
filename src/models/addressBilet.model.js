const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class AddressBiletModel extends Model {}

AddressBiletModel.init({
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
  modelName: 'AddressBiletModel',
  tableName: 'address_bilet',
  timestamps: true,
  paranoid: true,
});

module.exports = AddressBiletModel;