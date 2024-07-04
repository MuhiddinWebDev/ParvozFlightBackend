const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');

class ServicesCommentModel extends Model { }

ServicesCommentModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(256),
    allowNull: true
  },
  comment_uz: {
    type: DataTypes.STRING(256),
    allowNull: true
  },
  comment_ru: {
    type: DataTypes.STRING(256),
    allowNull: true
  },
  comment_ka: {
    type: DataTypes.STRING(256),
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'ServicesCommentModel',
  tableName: 'services_comment',
  timestamps: true,
  paranoid: true,
});


module.exports = ServicesCommentModel;