const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class RoomImageModel extends Model {}

RoomImageModel.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
}, {
  sequelize,
  modelName: 'RoomImageModel',
  tableName: 'room_image',
  timestamps: true,
  paranoid: true,
});


module.exports = RoomImageModel;