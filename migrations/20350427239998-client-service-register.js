"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "client_service_register",
        {
          id: {
            autoIncrement: true,
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
          },
          datetime: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
          },
          doc_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
          },
          client_service_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
          },
          client_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
          },
          type: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
          },
          summa: {
            type: Sequelize.DataTypes.DECIMAL(17, 3),
            allowNull: true,
          },
          doc_type: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: true,
          },
          place:{
            type: Sequelize.DataTypes.STRING(100),
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
          },
          deletedAt: {
            type: Sequelize.DataTypes.DATE,
          },
        },
        { transaction }
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
      await queryInterface.dropTable("client_service_register", {
        transaction,
      });
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  },
};
