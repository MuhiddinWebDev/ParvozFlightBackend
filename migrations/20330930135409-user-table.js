'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('user_table', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        user_id:{
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        title:{
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        name:{
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        icon:{
          type: Sequelize.DataTypes.STRING(256),
          allowNull: true,
        },
        status:{
          type: Sequelize.DataTypes.BOOLEAN,
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
      await queryInterface.dropTable('user_table', { transaction });

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
