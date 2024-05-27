'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('promocode', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true
        },
        phone: {
          type: Sequelize.DataTypes.STRING(25),
          allowNull: true
        },
        promocode: {
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
      await queryInterface.dropTable('promocode', { transaction });

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
