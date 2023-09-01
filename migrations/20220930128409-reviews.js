'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('reviews', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        rating: {
            type: Sequelize.DataTypes.FLOAT,
            allowNull: false,
        },
        name_uz: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: true,
        },
        name_ru: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: true,
        },
        name_ka: {
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
        // client_id: {
        //     type: Sequelize.DataTypes.INTEGER,
        //     references: {
        //       model: 'client',
        //       key: 'id'
        //     },
        //     onDelete: 'RESTRICT',
        //     onUpdate: 'CASCADE',
        // },
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
      await queryInterface.dropTable('reviews', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
