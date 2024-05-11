'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn('news', 'video', {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: true,
      });
      await queryInterface.addColumn('news', 'type', {
        type: Sequelize.DataTypes.STRING(20),
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

      await queryInterface.removeColumn('news', 'video');
      await queryInterface.removeColumn('news', 'type');

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
