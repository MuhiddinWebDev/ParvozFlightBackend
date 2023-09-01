'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('service_category', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        k_name_uz: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
        },
        k_name_ru: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
        },
        k_name_ka: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
        },
        k_image: {
          type: Sequelize.DataTypes.STRING(64),
          defaultValue: "",
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE
        },
        deletedAt: {
          type: Sequelize.DataTypes.DATE,
        },
      }, { transaction }
      );

      await queryInterface.addColumn('services', 'category_id', { 
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
      await queryInterface.dropTable('service_category', { transaction });
      await queryInterface.removeColumn('services', 'category_id', {transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
