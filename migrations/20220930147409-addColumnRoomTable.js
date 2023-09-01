'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn('room_table', 'lat', { 
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
      });

      await queryInterface.addColumn('room_table', 'long', { 
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
      });

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('room_table', 'lat', { /* query options */ });
      await queryInterface.removeColumn('room_table', 'long', { /* query options */ });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
