"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "static_order",
        {
          id: {
            autoIncrement: true,
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
          },
          client_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
          },
          region_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
          },
          passport: {
            type: Sequelize.DataTypes.STRING(128),
            allowNull: true,
          },
          migrant_carta: {
            type: Sequelize.DataTypes.STRING(128),
            allowNull: true,
          },
          phone: {
            type: Sequelize.DataTypes.STRING(20),
            allowNull: true,
          },
          total_sum:{
            type: Sequelize.DataTypes.DECIMAL(17,2),
            allowNull: true
          },
          status: {
            type: Sequelize.DataTypes.STRING(120),
            allowNull: true
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
      await queryInterface.dropTable("static_order", {
        transaction,
      });
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  },
};
