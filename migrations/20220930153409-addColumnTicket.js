'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn('tickets', 'whatsapp', { 
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false,
        defaultValue: ""
      });

      await queryInterface.addColumn('tickets', 'phone', { 
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false,
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
      await queryInterface.removeColumn('tickets', 'whatsapp', { /* query options */ });
      await queryInterface.removeColumn('tickets', 'phone', { /* query options */ });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
