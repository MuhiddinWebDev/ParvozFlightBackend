const { DataTypes, Model } = require('sequelize');
const ClientModel = require("./client.model");
const ChatProModel = require("./chatPro.model");
const WorkAddressModel = require("./work_address.model");
const sequelize = require('../db/db-sequelize');
class StaticOrderModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

StaticOrderModel.init({
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
  region_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  passport: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  migrant_carta: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  total_sum: {
    type: DataTypes.DECIMAL(17, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'StaticOrderModel',
  tableName: 'static_order',
  timestamps: true,
  paranoid: true,
});

StaticOrderModel.belongsTo(ClientModel, { as: 'client', foreignKey: 'client_id' })
StaticOrderModel.belongsTo(WorkAddressModel, { as: 'region', foreignKey: 'region_id' })
StaticOrderModel.hasMany(ChatProModel, { as: 'chat', foreignKey: 'order_id' });
ChatProModel.belongsTo(StaticOrderModel, { as: 'static_order', foreignKey: 'order_id' });
module.exports = StaticOrderModel;