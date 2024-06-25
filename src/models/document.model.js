const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class DocumentModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

DocumentModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  title_uz: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  title_ru: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  title_ka: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  file: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'DocumentModel',
  tableName: 'document',
  timestamps: true,
  paranoid: true,
});

module.exports = DocumentModel;