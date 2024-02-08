const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class ClientModel extends Model {}

ClientModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    fullname: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: ''
    },
    phone: {
      type: DataTypes.STRING(16),
      allowNull: false,
      // unique: true
    },
    code: {
      type: DataTypes.STRING(16),
      allowNull: true,
      // unique: true
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: true,
      // unique: true
    },
    fcm_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // unique: true
    },
    lang: {
      type: DataTypes.STRING(2),
      allowNull: true,
      defaultValue: "uz"
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    sex_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // unique: true
    },
    passport: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
}, {
  sequelize,
  modelName: 'ClientModel',
  tableName: 'client',
  timestamps: true,
  paranoid: true,
});

module.exports = ClientModel;