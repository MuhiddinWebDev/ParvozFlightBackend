'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('client_service', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        title_uz: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        title_ru: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        title_ka: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        summa: {
          type: Sequelize.DataTypes.DECIMAL(17, 3),
          allowNull: true
        },
        required: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true
        },
        status: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true
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

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('client_service', { transaction });
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
