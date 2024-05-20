const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class NewsModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

NewsModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  datetime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  text_uz: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  text_ru: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  text_ka: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  network: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  video: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'NewsModel',
  tableName: 'news',
  timestamps: true,
  paranoid: true,
});

module.exports = NewsModel;