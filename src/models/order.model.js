const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const ClientModel = require('./client.model');
const OrderStepsTableModel = require('../models/orderStepsTable.model');
const ServicesModel = require('./services.model');
const AgentModel = require('./agent.model');
const ChatModel = require('../models/chat.model');
class OrderModel extends Model {}

OrderModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return new Date(this.getDataValue('datetime')).getTime();
        }
    },
    service_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'services',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    },
    client_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'client',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    },
    agent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    pay_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    pay_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('waiting', 'done'),
      allowNull: false,
      defaultValue: 'waiting'
    },
    comment: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
    },
    comment_uz: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comment_ru: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comment_ka: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    summa: {
      type: DataTypes.DECIMAL(17, 3),
      allowNull: false,
      defaultValue: 0
    },
    discount_summa: {
      type: DataTypes.DECIMAL(17, 3),
      allowNull: true,
      defaultValue: 0
    },
    step_status: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: ''
    },
    step_title: {
      type: DataTypes.STRING(256),
      allowNull: false,
      defaultValue: ''
    },
}, {
  sequelize,
  modelName: 'OrderModel',
  tableName: 'order',
  timestamps: true,
  paranoid: true,
});


OrderModel.belongsTo(ClientModel, { as: 'client', foreignKey: 'client_id' });
OrderModel.belongsTo(AgentModel, { as: 'agent', foreignKey: 'agent_id' });
OrderModel.belongsTo(ServicesModel, { as: 'services', foreignKey: 'service_id' });
OrderModel.hasMany(OrderStepsTableModel, { as: 'order_steps_table', foreignKey: 'parent_id' });
OrderModel.hasMany(ChatModel, { as: 'chat', foreignKey: 'order_id' });
ChatModel.belongsTo(OrderModel, { as: 'order', foreignKey: 'order_id' });

module.exports = OrderModel;