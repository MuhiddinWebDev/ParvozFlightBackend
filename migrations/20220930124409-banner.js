'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('banner', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        image: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
          // unique: true
        },
        url: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false,
          // unique: true
        },
        description_uz: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true,
        },
        description_ru: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true,
        },
        description_ka: {
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
      await queryInterface.dropTable('banner', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};