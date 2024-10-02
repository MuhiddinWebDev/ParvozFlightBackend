const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class UserModel extends Model {
    toJSON() {//password ni ko'rsatmaslik uchun
        let values = Object.assign({}, this.get());
        delete values.password;
        delete values.createdAt;
        delete values.updatedAt;
        delete values.deletedAt;
        return values;
    }
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(25),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    fullname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('Admin', 'User', 'Programmer'),
        defaultValue: 'Admin'
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: ''
    },
    all_page: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    token: {
        type: DataTypes.VIRTUAL,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
}, {
    sequelize,
    modelName: 'UserModel',
    tableName: 'user',
    timestamps: true,
    paranoid: true,
});

module.exports = UserModel;