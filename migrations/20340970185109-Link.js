'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('link', {
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
        image: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        status: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true,
        },
        url: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
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
      await queryInterface.dropTable('link', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
