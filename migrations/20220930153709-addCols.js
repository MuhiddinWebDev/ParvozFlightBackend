'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn('work_table', 'sex_id', { 
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      });
    
      await queryInterface.addColumn('work_table', 'end_date', { 
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      });

      await queryInterface.addColumn('work_table', 'start_age', { 
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue:18
      });
      await queryInterface.addColumn('work_table', 'end_age', { 
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue:35
      });
      await queryInterface.addColumn('client', 'age', { 
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue:18
      });
      await queryInterface.addColumn('client', 'password', { 
        type: Sequelize.DataTypes.STRING(120),
        allowNull: true,
      });
      await queryInterface.addColumn('client', 'sex_id', { 
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue:2
      });
      await queryInterface.addColumn('client', 'file_front', { 
        type: Sequelize.DataTypes.STRING(120),
        allowNull: true,
      });
      await queryInterface.addColumn('client', 'file_back', { 
        type: Sequelize.DataTypes.STRING(120),
        allowNull: true,
      });
      await queryInterface.addColumn('room_table', 'sex_id', { 
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue:1
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
      await queryInterface.removeColumn('work_table', 'sex_id');
      await queryInterface.removeColumn('work_table', 'end_date');
      await queryInterface.removeColumn('work_table', 'start_age');
      await queryInterface.removeColumn('work_table', 'end_age');
      await queryInterface.removeColumn('client', 'age');
      await queryInterface.removeColumn('client', 'password');
      await queryInterface.removeColumn('client', 'sex_id');
      await queryInterface.removeColumn('client', 'file_front');
      await queryInterface.removeColumn('client', 'file_back');
      await queryInterface.removeColumn('room_table', 'sex_id');
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
