const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const UserModel = require("../models/user.model")
class UserTableModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

UserTableModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'UserTableModel',
  tableName: 'user_table',
  timestamps: true,
  paranoid: true,
});

UserModel.hasMany(UserTableModel, { as: 'user_table', foreignKey: 'user_id' })
module.exports = UserTableModel;