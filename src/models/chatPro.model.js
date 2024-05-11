const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const UserModel = require('./user.model');
class ChatProModel extends Model {}

ChatProModel.init({
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
        allowNull: true
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
  modelName: 'ChatProModel',
  tableName: 'chat_pro',
  timestamps: true,
  paranoid: true,
});


ChatProModel.belongsTo(UserModel, { as: 'user', foreignKey: 'user_id' });

module.exports = ChatProModel;