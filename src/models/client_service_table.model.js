const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class ClientServiceTableModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

ClientServiceTableModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  datetime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  total_sum: {
    type: DataTypes.DECIMAL(17, 3),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'ClientServiceTableModel',
  tableName: 'client_service_table',
  timestamps: true,
  paranoid: true,
});

module.exports = ClientServiceTableModel;