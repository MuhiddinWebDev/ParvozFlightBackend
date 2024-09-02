const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class LinksModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

LinksModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  android: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ios: {
    type: DataTypes.TEXT,
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'LinkModel',
  tableName: 'links',
  timestamps: true,
  paranoid: true,
});

module.exports = LinksModel;