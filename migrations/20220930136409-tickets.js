'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('tickets', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        client_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        transport_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        from_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        to_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
          type: Sequelize.DataTypes.STRING(16),
          allowNull: false,
        },
        comment: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
          defaultValue: ""
        },
        operator_comment: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
          defaultValue: ""
        },
        status: {
          type: Sequelize.DataTypes.ENUM('waiting', 'done', 'rejected'),
          allowNull: false,
          defaultValue: 'waiting'
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
      await queryInterface.dropTable('tickets', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
