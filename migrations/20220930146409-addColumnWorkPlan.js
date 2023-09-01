'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('work_table', 'address_id', { 
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      });

      await queryInterface.addColumn('work_table', 'lat', { 
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
      });

      await queryInterface.addColumn('work_table', 'long', { 
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
      });

      await queryInterface.addColumn('work_table', 'create_at', { 
        type: Sequelize.DataTypes.STRING(16),
        allowNull: false,
        defaultValue: ''
      });

      await queryInterface.addColumn('work_table', 'price_type_uz', { 
        type: Sequelize.DataTypes.STRING(32),
        allowNull: true,
        defaultValue: ''
      });

      await queryInterface.addColumn('work_table', 'price_type_ru', { 
        type: Sequelize.DataTypes.STRING(32),
        allowNull: true,
        defaultValue: ''
      });

      await queryInterface.addColumn('work_table', 'price_type_ka', { 
        type: Sequelize.DataTypes.STRING(32),
        allowNull: true,
        defaultValue: ''
      });

      await queryInterface.addColumn('work_table', 'status', { 
        type: Sequelize.DataTypes.ENUM('new', 'active', 'rejected'),
        allowNull: false,
        defaultValue: 'new'
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
      await queryInterface.removeColumn('work_table', 'status', { /* query options */ });
      await queryInterface.removeColumn('work_table', 'price_type_ka', { /* query options */ });
      await queryInterface.removeColumn('work_table', 'price_type_ru', { /* query options */ });
      await queryInterface.removeColumn('work_table', 'price_type_uz', { /* query options */ });
      await queryInterface.removeColumn('work_table', 'create_at', { /* query options */ });
      await queryInterface.removeColumn('work_table', 'lat', { /* query options */ });
      await queryInterface.removeColumn('work_table', 'long', { /* query options */ });
      await queryInterface.removeColumn('work_table', 'address_id', { /* query options */ });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
