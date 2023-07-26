'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('services_steps_table', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        parent_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        title_uz: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false
        },
        title_ru: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false
        },
        title_ka: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false
        },
        promocode: {
          type: Sequelize.DataTypes.STRING(15),
          allowNull: true,
          defaultValue: ''
        },
        check_promocode: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        active_promocode: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        status: {
          type: Sequelize.DataTypes.ENUM('waiting', 'active', 'checking', 'done'),
          allowNull: true,
          defaultValue: 'waiting'
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
        action: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true
        },
        action_title_uz: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
          defaultValue: ""
        },
        action_title_ru: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
          defaultValue: ""
        },
        action_title_ka: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
          defaultValue: ""
        },
        active: {
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
      await queryInterface.dropTable('services_steps_table', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
