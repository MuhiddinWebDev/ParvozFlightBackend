'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('room_table', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        parent_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        address_uz: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        address_ru: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        address_ka: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        price: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        phone_number: {
          type: Sequelize.DataTypes.STRING(16),
          allowNull: false,
        },
        comment_uz: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        comment_ru: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        comment_ka: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        area: {
          type: Sequelize.DataTypes.STRING(64),
          allowNull: true,
          defaultValue: ""
        },
        status: {
          type: Sequelize.DataTypes.ENUM('empty', 'busy'),
          allowNull: false,
          defaultValue: 'empty'
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
      await queryInterface.dropTable('room_table', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
