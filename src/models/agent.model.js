const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class AgentModel extends Model {
  toJSON () {//password ni ko'rsatmaslik uchun
  let values = Object.assign({}, this.get());
      delete values.password;
      return values;
  }
}

AgentModel.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(64),
      defaultValue: '',
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: ""
    },
    which_airline: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: ""
    }
}, {
  sequelize,
  modelName: 'AgentModel',
  tableName: 'agent',
  timestamps: true,
  paranoid: true,
});

module.exports = AgentModel;