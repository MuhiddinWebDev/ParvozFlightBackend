const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class ClientServiceModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

ClientServiceModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
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
  summa: {
    type: DataTypes.DECIMAL(17, 3),
    allowNull: true
  },
  required: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'ClientServiceModel',
  tableName: 'client_service',
  timestamps: true,
  paranoid: true,
});

module.exports = ClientServiceModel;