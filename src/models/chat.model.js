const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const OrderModel = require('./order.model');
const UserModel = require('./user.model');
class ChatModel extends Model {}

ChatModel.init({
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
    order_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'order',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    voice: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: ''
    },
    file: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: ''
    },
    image: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: ''
    },
    view: {
      type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    seen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_voice: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
}, {
  sequelize,
  modelName: 'ChatModel',
  tableName: 'chat',
  timestamps: true,
  paranoid: true,
});


ChatModel.belongsTo(UserModel, { as: 'user', foreignKey: 'user_id' });

module.exports = ChatModel;