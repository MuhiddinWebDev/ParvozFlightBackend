'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('agent', 'password', { 
        type: Sequelize.DataTypes.STRING(64),
        defaultValue: '',
        allowNull: true
      });

      await queryInterface.addColumn('agent', 'token', { 
        type: Sequelize.DataTypes.STRING(64),
        allowNull: true,
        defaultValue: ""
      });

      await queryInterface.addColumn('agent', 'which_airline', { 
        type: Sequelize.DataTypes.STRING(256),
        allowNull: true,
        defaultValue: ""
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
      await queryInterface.removeColumn('agent', 'password', { /* query options */ });
      await queryInterface.removeColumn('agent', 'token', { /* query options */ });
      await queryInterface.removeColumn('agent', 'which_airline', { /* query options */ });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
