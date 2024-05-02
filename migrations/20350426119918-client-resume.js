'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('client_resume', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        surname: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        name: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        sex_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        },
        client_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        },
        phone: {
          type: Sequelize.DataTypes.STRING(20),
          allowNull: true,
        },
        work_type_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        },
        job: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        address_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        },
        salary_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        },
        work_time: {
          type: Sequelize.DataTypes.STRING(10),
          allowNull: true,
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

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('client_resume', { transaction });
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
