const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class AboutUsModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

AboutUsModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  telegram: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  instagram: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  facebook: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'AboutUsModel',
  tableName: 'about_us',
  timestamps: true,
  paranoid: true,
});

module.exports = AboutUsModel;