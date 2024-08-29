'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('room_table', 'datetime', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      });
      transaction.commit();

    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('room_table', 'datetime');
      transaction.commit();

    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
