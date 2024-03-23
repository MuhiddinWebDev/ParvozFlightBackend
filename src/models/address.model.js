const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class AddressModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

AddressModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
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
}, {
  sequelize,
  modelName: 'AddressModel',
  tableName: 'address',
  timestamps: true,
  paranoid: true,
});

module.exports = AddressModel;