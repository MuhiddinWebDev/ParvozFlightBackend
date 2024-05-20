const { DataTypes, Model } = require('sequelize');
const ClientModel = require("./client.model");
const AddressModel = require("./address.model")
const WorkModel = require("./work.model")
const sequelize = require('../db/db-sequelize');
class ClientResumeModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

ClientResumeModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  surname: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  sex_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  job_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  salary: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  work_time: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'ClientResumeModel',
  tableName: 'client_resume',
  timestamps: true,
  paranoid: true,
});

ClientResumeModel.belongsTo(ClientModel, { as: 'client', foreignKey: 'client_id' })
ClientResumeModel.belongsTo(AddressModel, { as: 'address', foreignKey: 'address_id' })
module.exports = ClientResumeModel;