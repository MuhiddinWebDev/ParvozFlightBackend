const { DataTypes, Model } = require('sequelize');
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
  work_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  job: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  salary_id: {
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

module.exports = ClientResumeModel;