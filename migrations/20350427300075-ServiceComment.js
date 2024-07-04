'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('services_comment', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        service_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        },
        icon: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true
        },
        comment_uz: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true
        },
        comment_ru: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true
        },
        comment_ka: {
          type: Sequelize.DataTypes.STRING(256),
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
      await queryInterface.dropTable('services_comment', { transaction });

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
