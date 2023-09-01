'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('room_image', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        parent_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        image: {
          type: Sequelize.DataTypes.STRING(128),
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
      await queryInterface.dropTable('room_image', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
