const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class ServiceCategoryModel extends Model {}

ServiceCategoryModel.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    k_name_uz: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    k_name_ru: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    k_name_ka: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    k_image: {
      type: DataTypes.STRING(64),
      defaultValue: "",
      allowNull: true
    },
}, {
  sequelize,
  modelName: 'ServiceCategoryModel',
  tableName: 'service_category',
  timestamps: true,
  paranoid: true,
});

module.exports = ServiceCategoryModel;