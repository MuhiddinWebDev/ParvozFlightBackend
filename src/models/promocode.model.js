const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class PromocodeModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

PromocodeModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(256),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  promocode: {
    type: DataTypes.STRING(256),
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'PromocodeModel',
  tableName: 'promocode',
  timestamps: true,
  paranoid: true,
});

module.exports = PromocodeModel;