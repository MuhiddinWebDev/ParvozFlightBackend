const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class WorkAdressModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

WorkAdressModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name_uz: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  name_ru: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  name_ka: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'WorkAdressModel',
  tableName: 'work_address',
  timestamps: true,
  paranoid: true,
});

module.exports = WorkAdressModel;