const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const WorkTableModel = require('./workTable.model');
class WorkModel extends Model {}

WorkModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    title_uz: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    title_ru: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    title_ka: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
}, {
  sequelize,
  modelName: 'WorkModel',
  tableName: 'works',
  timestamps: true,
  paranoid: true,
});

WorkModel.hasMany(WorkTableModel, { as: 'work_table', foreignKey: 'parent_id' });
WorkTableModel.belongsTo(WorkModel, { as: 'work', foreignKey: 'parent_id' });

module.exports = WorkModel;