const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class ClientServiceRegister extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

ClientServiceRegister.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  datetime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  doc_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  region_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  client_service_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  summa: {
    type: DataTypes.DECIMAL(17, 3),
    allowNull: true,
  },
  doc_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  place: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'ClientServiceRegister',
  tableName: 'client_service_register',
  timestamps: true,
  paranoid: true,
});

module.exports = ClientServiceRegister;