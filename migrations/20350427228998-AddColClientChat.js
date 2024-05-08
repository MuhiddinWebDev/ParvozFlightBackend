'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn('chat', 'file', {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: true,
      });
      await queryInterface.addColumn('chat', 'image', {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: true,
      });
      await queryInterface.addColumn('client', 'region_id', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      });
      await queryInterface.addColumn('client', 'address', {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: true,
      });
      await queryInterface.addColumn('client', 'name', {
        type: Sequelize.DataTypes.STRING(256),
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

      await queryInterface.removeColumn('chat', 'file');
      await queryInterface.removeColumn('chat', 'image');
      await queryInterface.removeColumn('client', 'region_id');
      await queryInterface.removeColumn('client', 'address');
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
