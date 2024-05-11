'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('chat_pro', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        datetime: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          get() {
            return new Date(this.getDataValue('datetime')).getTime();
          }
        },
        order_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        user_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        text: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        voice: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: true,
          defaultValue: ''
        },
        file: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: true,
          defaultValue: ''
        },
        image: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: true,
          defaultValue: ''
        },
        view: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        seen: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        is_voice: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
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
      await queryInterface.dropTable('chat_pro', { transaction });

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
