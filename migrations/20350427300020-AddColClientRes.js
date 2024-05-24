'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn('client', 'promocode', {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: true,
      });
      await queryInterface.addColumn('client_resume', 'status', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
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

      await queryInterface.removeColumn('client', 'promocode');
      await queryInterface.removeColumn('client_resume', 'status');

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
