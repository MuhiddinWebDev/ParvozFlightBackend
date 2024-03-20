'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn('user', 'all_page', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      });
      await queryInterface.addColumn('room_table', 'user_id', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        });
      
      await queryInterface.addColumn('room_table', 'client_id', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      });

      await queryInterface.addColumn('work_table', 'user_id', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      });
      await queryInterface.addColumn('work_table', 'client_id', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      });
      await queryInterface.addColumn('services', 'user_id', {
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
      await queryInterface.removeColumn('user', 'all_page');
      await queryInterface.removeColumn('room_table', 'user_id');
      await queryInterface.removeColumn('room_table', 'client_id');
      await queryInterface.removeColumn('work_table', 'user_id');
      await queryInterface.removeColumn('work_table', 'client_id');
      await queryInterface.removeColumn('services', 'user_id');
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
