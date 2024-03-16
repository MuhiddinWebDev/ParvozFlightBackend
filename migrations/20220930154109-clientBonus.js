'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn('client', 'bonus', {
        type: Sequelize.DataTypes.DECIMAL(11, 2),
        allowNull: true,
        defaultValue: 0
      });
      await queryInterface.addColumn('client', 'isLogin', {
        type: Sequelize.DataTypes.BOOLEAN,
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
      await queryInterface.removeColumn('client', 'bonus');
      await queryInterface.removeColumn('client', 'isLogin');
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
