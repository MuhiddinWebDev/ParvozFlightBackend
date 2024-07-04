'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('services', 'comment_icon', {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: true,
      });
      await queryInterface.addColumn('services', 'title_uz', {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: true,
      });
      await queryInterface.addColumn('services', 'title_ru', {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: true,
      });
      await queryInterface.addColumn('services', 'title_ka', {
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
      await queryInterface.removeColumn('services', 'comment_icon');
      await queryInterface.removeColumn('services', 'title_uz');
      await queryInterface.removeColumn('services', 'title_ru');
      await queryInterface.removeColumn('services', 'title_ka');
      transaction.commit();

    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
