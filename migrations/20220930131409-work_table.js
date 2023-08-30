'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('work_table', {
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
          type: Sequelize.DataTypes.STRING(128),
          allowNull: true,
        },
        title_ru: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: true,
        },
        title_ka: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: true,
        },
        image: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: true,
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
        from_price: {
          type: Sequelize.DataTypes.DECIMAL(17, 2),
          allowNull: false,
          defaultValue: 0
        },
        to_price: {
          type: Sequelize.DataTypes.DECIMAL(17, 2),
          allowNull: false,
          defaultValue: 0
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
      await queryInterface.dropTable('work_table', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
