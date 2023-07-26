'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('booked_ticket', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        from_where_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        to_where_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        date_flight: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            get() {
                return new Date(this.getDataValue('date_flight')).getTime();
            }
        },
        baggage: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        status: {
          type: Sequelize.DataTypes.ENUM('New', 'View', 'Done', 'Canceled'),
          allowNull: true,
          defaultValue: 'New'
        },
        client_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
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
      await queryInterface.dropTable('booked_ticket', { transaction });      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
