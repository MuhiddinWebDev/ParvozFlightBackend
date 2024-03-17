const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class MenuTableModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

MenuTableModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
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
  modelName: 'MenuTableModel',
  tableName: 'menu_table',
  timestamps: true,
  paranoid: true,
});

module.exports = MenuTableModel;