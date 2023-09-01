const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class BannerModel extends Model {}

BannerModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    image: {
      type: DataTypes.STRING(128),
      allowNull: false,
      // unique: true
    },
    url: {
      type: DataTypes.STRING(256),
      allowNull: false,
      // unique: true
    },
    description: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      defaultValue : 0,
  },
    description_uz: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description_ru: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description_ka: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
  sequelize,
  modelName: 'BannerModel',
  tableName: 'banner',
  timestamps: true,
  paranoid: true,
});

module.exports = BannerModel;