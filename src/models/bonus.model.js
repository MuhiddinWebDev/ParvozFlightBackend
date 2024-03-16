const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class BonusModel extends Model { }

BonusModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  summa: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: true,
  },

}, {
  sequelize,
  modelName: 'BonusModel',
  tableName: 'bonus',
  timestamps: true,
  paranoid: true,
});

module.exports = BonusModel;