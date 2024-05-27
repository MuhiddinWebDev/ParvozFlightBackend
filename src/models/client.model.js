const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/db-sequelize");
const ClientTableModel = require('./clientTable.model');
const PromocodeModel = require("./promocode.model")
class ClientModel extends Model {
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.password;
    delete values.createdAt;
    delete values.updatedAt;
    delete values.deletedAt;
    return values;
  }

}

ClientModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: "",
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: "",
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: "",
    },
    phone: {
      type: DataTypes.STRING(16),
      allowNull: false,
      // unique: true
    },
    code: {
      type: DataTypes.STRING(16),
      allowNull: true,
      // unique: true
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: true,
      // unique: true
    },
    fcm_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // unique: true
    },
    lang: {
      type: DataTypes.STRING(2),
      allowNull: true,
      defaultValue: "uz",
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bonus: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    isLogin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(120),
      allowNull: true,
      defaultValue: ""
    },
    sex_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // unique: true
    },
    file_front: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    file_back: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    promocode: {
      type: DataTypes.STRING(256),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "ClientModel",
    tableName: "client",
    timestamps: true,
    paranoid: true,
  }
);

ClientModel.hasMany(ClientTableModel, { as: 'client_table', foreignKey: 'client_id' });

module.exports = ClientModel;
