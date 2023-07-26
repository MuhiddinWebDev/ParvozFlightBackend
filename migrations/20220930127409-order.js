'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('order', {
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
        service_id: {
            type: Sequelize.DataTypes.INTEGER,
            references: {
              model: 'services',
              key: 'id'
            },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        },
        client_id: {
            type: Sequelize.DataTypes.INTEGER,
            references: {
              model: 'client',
              key: 'id'
            },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        },
        agent_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        user_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        pay_user_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        pay_status: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        status: {
          type: Sequelize.DataTypes.ENUM('waiting', 'done'),
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
        summa: {
          type: Sequelize.DataTypes.DECIMAL(17, 3),
          allowNull: false,
          defaultValue: 0
        },
        discount_summa: {
          type: Sequelize.DataTypes.DECIMAL(17, 3),
          allowNull: true,
          defaultValue: 0
        },
        step_status: {
          type: Sequelize.DataTypes.STRING(15),
          allowNull: true,
          defaultValue: ''
        },
        step_title: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false,
          defaultValue: ''
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
      await queryInterface.dropTable('order', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
