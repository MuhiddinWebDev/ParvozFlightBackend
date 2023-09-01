'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        "ALTER TABLE room_table DROP COLUMN address_uz, DROP COLUMN address_ru, DROP COLUMN address_ka",
        {
          type: Sequelize.QueryTypes.UPDATE
        }
      );

      await queryInterface.addColumn('room_table', 'address_id', { 
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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
      await queryInterface.removeColumn('room_table', 'address_id', { /* query options */ });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
