const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const ServicesStepsTableModel = require('../models/servicesStepsTable.model');
const ServiceCategoryModel = require('../models/serviceCategory.model');
const ServicesCommentModel = require("../models/servicesComment.model")
class ServicesModel extends Model { }

ServicesModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  category_id: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  name_uz: {
    type: DataTypes.STRING(256),
    allowNull: false,
    unique: true
  },
  name_ru: {
    type: DataTypes.STRING(256),
    allowNull: false,
    unique: true
  },
  name_ka: {
    type: DataTypes.STRING(256),
    allowNull: false,
    unique: true
  },
  title_uz: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  title_ru: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  title_ka: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  average_date: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
  },
  average_date_uz: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
  average_date_ru: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
  average_date_ka: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  comment_icon: {
    type: DataTypes.STRING(128),
    allowNull: false,
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
  summa: {
    type: DataTypes.DECIMAL(17, 3),
    allowNull: false,
    defaultValue: 0
  },
  discount_summa: {
    type: DataTypes.DECIMAL(17, 3),
    allowNull: true,
    defaultValue: 0
  },
}, {
  sequelize,
  modelName: 'ServicesModel',
  tableName: 'services',
  timestamps: true,
  paranoid: true,
});


ServicesModel.hasMany(ServicesCommentModel, { as: 'service_comment', foreignKey: 'service_id' });
ServicesModel.hasMany(ServicesStepsTableModel, { as: 'services_steps_table', foreignKey: 'parent_id' });
ServicesModel.belongsTo(ServiceCategoryModel, { as: 'service_category', foreignKey: 'category_id' });

module.exports = ServicesModel;