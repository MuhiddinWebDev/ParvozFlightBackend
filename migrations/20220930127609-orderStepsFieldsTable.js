'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('order_steps_fields_table', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        steps_parent_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        title_uz: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
          defaultValue: ""
        },
        title_ru: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
          defaultValue: ""
        },
        title_ka: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
          defaultValue: ""
        },
        type: {
          type: Sequelize.DataTypes.ENUM('image', 'file', 'number','text','date'),
          allowNull: true,
          defaultValue: 'image'
        },
        value: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true
        },
        column_status: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true
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

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('order_steps_fields_table', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
