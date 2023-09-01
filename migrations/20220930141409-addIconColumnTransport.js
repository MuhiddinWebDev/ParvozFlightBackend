'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('transport', 'icon', { 
        type: Sequelize.DataTypes.STRING(64),
        defaultValue: '',
        allowNull: true
      });

      await queryInterface.addColumn('transport', 'link', { 
        type: Sequelize.DataTypes.STRING(256),
        defaultValue: '',
        allowNull: true
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
      await queryInterface.removeColumn('transport', 'icon', { /* query options */ });
      await queryInterface.removeColumn('transport', 'link', { /* query options */ });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
