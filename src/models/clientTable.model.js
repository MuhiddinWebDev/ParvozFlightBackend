const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class ClientTableModel extends Model { 
  toJSON () {//password ni ko'rsatmaslik uchun
    let values = Object.assign({}, this.get());
        delete values.client_id;
        delete values.createdAt;
        delete values.updatedAt;
        delete values.deletedAt;
        return values;
    }
}


ClientTableModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  client_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  file: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ClientTableModel',
  tableName: 'client_table',
  timestamps: true,
  paranoid: true,
});


module.exports = ClientTableModel;