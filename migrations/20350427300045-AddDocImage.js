'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('document', 'image', {
        type: Sequelize.DataTypes.STRING(256),
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
      await queryInterface.removeColumn('document', 'image');
      transaction.commit();

    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
