'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('services', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        name_uz: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false,
          unique: false
        },
        name_ru: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false,
          unique: false
        },
        name_ka: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false,
          unique: false
        },
        average_date_uz: {
          type: Sequelize.DataTypes.STRING(8),
          allowNull: false,
        },
        average_date_ru: {
          type: Sequelize.DataTypes.STRING(8),
          allowNull: false,
        },
        average_date_ka: {
          type: Sequelize.DataTypes.STRING(8),
          allowNull: false,
        },
        icon: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
        },
        comment_uz: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        comment_ru: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        comment_ka: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        summa: {
          type: Sequelize.DataTypes.DECIMAL(17, 3),
          allowNull: false,
          defaultValue: 0
        },
        discount_summa: {
          type: Sequelize.DataTypes.DECIMAL(17, 3),
          allowNull: true,
          defaultValue: 0
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
      await queryInterface.dropTable('services', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
