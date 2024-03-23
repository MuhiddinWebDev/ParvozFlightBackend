const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/db-sequelize");
const RoomImageModel = require("./roomImage.model");

const ClietModel = require("../models/client.model");
const UserModel = require("../models/user.model");
const AddressModel = require("./address.model");
class RoomTableModel extends Model { 
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }
}

RoomTableModel.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sex_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    comment_uz: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comment_ru: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comment_ka: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    area: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: "",
    },
    status: {
      type: DataTypes.ENUM("empty", "busy"),
      allowNull: true,
      defaultValue: "empty",
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    long: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "RoomTableModel",
    tableName: "room_table",
    timestamps: true,
    paranoid: true,
  }
);



RoomTableModel.hasMany(RoomImageModel, {
  as: "images",
  foreignKey: "parent_id",
});
RoomTableModel.belongsTo(AddressModel, {
  as: "address",
  foreignKey: "address_id",
});



RoomTableModel.belongsTo(UserModel, { as: "user", foreignKey: "user_id" });
RoomTableModel.belongsTo(ClietModel, { as: "client", foreignKey: "client_id" });

module.exports = RoomTableModel;
