const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const ClientModel = require('./client.model');
const AddressBiletModel = require('./addressBilet.model');
class BookedTicketModel extends Model {}

BookedTicketModel.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    from_where_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_where_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_flight: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return new Date(this.getDataValue('date_flight')).getTime();
        }
    },
    baggage: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('New', 'View', 'Done', 'Canceled'),
      allowNull: true,
      defaultValue: 'New'
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
}, {
  sequelize,
  modelName: 'BookedTicketModel',
  tableName: 'booked_ticket',
  timestamps: true,
  paranoid: true,
});

BookedTicketModel.belongsTo(ClientModel, { as: 'client', foreignKey: 'client_id' });
BookedTicketModel.belongsTo(AddressBiletModel, { as: 'from_where', foreignKey: 'from_where_id' });
BookedTicketModel.belongsTo(AddressBiletModel, { as: 'to_where', foreignKey: 'to_where_id' });

module.exports = BookedTicketModel;