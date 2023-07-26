const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const TransportModel = require('./transport.model');
const AddressModel = require('./address.model');
const ClientModel = require('./client.model');
const AgentModel = require('./agent.model');
const UserModel = require('./user.model');
class TicketsModel extends Model {}

TicketsModel.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    client_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    parent_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    transport_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    from_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    to_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
      type: DataTypes.STRING(16),
      allowNull: true,
      defaultValue: ''
    },
    end_date: {
      type: DataTypes.STRING(16),
      allowNull: true,
      defaultValue: ''
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ""
    },
    operator_comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ""
    },
    status: {
      type: DataTypes.ENUM('waiting', 'done', 'rejected'),
      allowNull: false,
      defaultValue: 'waiting'
    },
    currency: {
      type: DataTypes.ENUM('USD','RUB','UZS'),
      allowNull: false,
      defaultValue: 'USD'
    },
    image: {
      type: DataTypes.STRING(64),
      defaultValue: '',
      allowNull: true
    },
    company_name: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: ""
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    baggage: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    rushnoy: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: ""
    },
    is_user: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
}, {
  sequelize,
  modelName: 'TicketsModel',
  tableName: 'tickets',
  timestamps: true,
  paranoid: true,
});


TicketsModel.belongsTo(TransportModel, { as: 'transport', foreignKey: 'transport_id' });
TicketsModel.belongsTo(AddressModel , { as: 'from', foreignKey: 'from_id' });
TicketsModel.belongsTo(AddressModel , { as: 'to', foreignKey: 'to_id' });
TicketsModel.belongsTo(ClientModel , { as: 'client', foreignKey: 'client_id' });
TicketsModel.belongsTo(AgentModel , { as: 'agent', foreignKey: 'creator_id' });
TicketsModel.belongsTo(UserModel , { as: 'user', foreignKey: 'creator_id' });

module.exports = TicketsModel;