const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/db-sequelize");
const AddressModel = require("./address.model");
const UserModel = require('../models/user.model');
const ClientModel = require('../models/client.model');
class WorkTableModel extends Model { }

WorkTableModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    finished: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'no'
    },
    sex_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    start_age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    end_age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title_uz: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    title_ru: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    title_ka: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "",
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
    from_price: {
      type: DataTypes.DECIMAL(17, 2),
      allowNull: false,
      defaultValue: 0,
    },
    to_price: {
      type: DataTypes.DECIMAL(17, 2),
      allowNull: false,
      defaultValue: 0,
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    create_at: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: "",
    },
    price_type_uz: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: "",
    },
    price_type_ru: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: "",
    },
    price_type_ka: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: "",
    },
    status: {
      type: DataTypes.ENUM("new", "active", "rejected"),
      allowNull: false,
      defaultValue: "new",
    },
  },
  {
    sequelize,
    modelName: "WorkTableModel",
    tableName: "work_table",
    timestamps: true,
    paranoid: true,
  }
);

// price type lar { oylik, kunlik, kelishiladi} degan statuslar uchun
WorkTableModel.belongsTo(AddressModel, {
  as: "address",
  foreignKey: "address_id",
});
WorkTableModel.belongsTo(UserModel, { as: 'user', foreignKey: 'user_id' });
WorkTableModel.belongsTo(ClientModel, { as: 'client', foreignKey: 'client_id' });
module.exports = WorkTableModel;
