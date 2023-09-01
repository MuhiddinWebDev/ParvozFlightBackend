const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const ClientModel = require('./client.model');
class ReviewsModel extends Model {}

ReviewsModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    name: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
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
    image: {
      type: DataTypes.STRING(128),
      allowNull: true,
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
    // client_id: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //       model: 'client',
    //       key: 'id'
    //     },
    //     onDelete: 'RESTRICT',
    //     onUpdate: 'CASCADE',
    // },
}, {
  sequelize,
  modelName: 'ReviewsModel',
  tableName: 'reviews',
  timestamps: true,
  paranoid: true,
});

// ReviewsModel.belongsTo(ClientModel, { as: 'client', foreignKey: 'client_id' });

module.exports = ReviewsModel;