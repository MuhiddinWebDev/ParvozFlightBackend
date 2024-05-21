const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const ClientJobChildModel = require('./clientJobChild.model')
class ClientJobModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

ClientJobModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name_uz: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  name_ru: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  name_ka: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'ClientJobModel',
  tableName: 'client_job',
  timestamps: true,
  paranoid: true,
});
ClientJobModel.hasMany(ClientJobChildModel, { as: 'job_table', foreignKey: 'parent_id' });
ClientJobChildModel.belongsTo(ClientJobModel, { as: 'job', foreignKey: 'parent_id' });
module.exports = ClientJobModel;