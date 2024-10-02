'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn('user', 'deleted', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
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

      await queryInterface.removeColumn('user', 'deleted');

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
