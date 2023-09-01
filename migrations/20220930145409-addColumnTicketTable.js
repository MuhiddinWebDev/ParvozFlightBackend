'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('tickets', 'image', { 
        type: Sequelize.DataTypes.STRING(64),
        defaultValue: '',
        allowNull: true
      });

      await queryInterface.addColumn('tickets', 'company_name', { 
        type: Sequelize.DataTypes.STRING(64),
        allowNull: true,
        defaultValue: ""
      });

      await queryInterface.addColumn('tickets', 'price', { 
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      });

      await queryInterface.addColumn('tickets', 'baggage', { 
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      });

      await queryInterface.addColumn('tickets', 'rushnoy', { 
        type: Sequelize.DataTypes.STRING(32),
        allowNull: true,
        defaultValue: ""
      });

      await queryInterface.addColumn('tickets', 'is_user', { 
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      });

      await queryInterface.addColumn('tickets', 'creator_id', { 
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      });
        
      await queryInterface.changeColumn('tickets', 'client_id', { 
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },{transaction});

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('tickets', 'image', { /* query options */ });
      await queryInterface.removeColumn('tickets', 'price', { /* query options */ });
      await queryInterface.removeColumn('tickets', 'baggage', { /* query options */ });
      await queryInterface.removeColumn('tickets', 'company_name', { /* query options */ });
      await queryInterface.removeColumn('tickets', 'rushnoy', { /* query options */ });
      await queryInterface.removeColumn('tickets', 'is_user', { /* query options */ });
      await queryInterface.removeColumn('tickets', 'creator_id', { /* query options */ });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
