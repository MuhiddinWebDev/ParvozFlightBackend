'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        "ALTER TABLE `tickets` CHANGE `currency` `currency` ENUM('som', 'USD','RUB','UZS') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'RUB'",
        {
          type: Sequelize.QueryTypes.UPDATE
        }
      );

      await queryInterface.sequelize.query(
        "update tickets set currency = 'RUB' WHERE currency = 'som' or currency = 'rubl'",
        {
          type: Sequelize.QueryTypes.UPDATE
        }
      );

      await queryInterface.sequelize.query(
        "ALTER TABLE `tickets` CHANGE `currency` `currency` ENUM('USD','RUB','UZS') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'RUB'",
        {
          type: Sequelize.QueryTypes.UPDATE
        }
      );

      await queryInterface.addColumn('tickets', 'parent_id', { 
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
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
      await queryInterface.removeColumn('tickets', 'parent_id', { /* query options */ });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
