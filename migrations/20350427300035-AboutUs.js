'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('about_us', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        telegram: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        },
        instagram: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        },
        facebook: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        },
        phone: {
          type: Sequelize.DataTypes.STRING(25),
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
      await queryInterface.dropTable('about_us', { transaction });

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
