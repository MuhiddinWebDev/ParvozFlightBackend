'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('client', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        fullname: {
          type: Sequelize.DataTypes.STRING(64),
          allowNull: true
        },
        phone: {
          type: Sequelize.DataTypes.STRING(16),
          allowNull: false,
          // unique: true
        },
        code: {
          type: Sequelize.DataTypes.STRING(16),
          allowNull: false,
          // unique: true
        },
        token: {
          type: Sequelize.DataTypes.STRING(64),
          allowNull: true,
          // unique: true
        },
        fcm_token: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true,
          // unique: true
        },
        lang: {
          type: Sequelize.DataTypes.STRING(2),
          allowNull: true,
          defaultValue: "uz"
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE
        },
        deletedAt: {
          type: Sequelize.DataTypes.DATE,
        },
      }, { transaction }
      );

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('client', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
