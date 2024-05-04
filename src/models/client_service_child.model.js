const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class ClientServiceChildModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

ClientServiceChildModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  doc_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  client_service_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  summa: {
    type: DataTypes.DECIMAL(17, 3),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'ClientServiceChildModel',
  tableName: 'client_service_child',
  timestamps: true,
  paranoid: true,
});

module.exports = ClientServiceChildModel;