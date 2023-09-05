const cron = require("node-cron");
const TicketModel = require("../models/tickets.model");
const sequelize = require("../db/db-sequelize");
const moment = require('moment');

const { Op } = require("sequelize");

module.exports = function executeTaskFromDatabase() {
    cron.schedule("*/20 * * * *", async () => {
        try {
            const result = await checkTicket(); // Await the async function and get the result
            console.log(result); // Log the result
        } catch (err) {
            console.error("Error executing task:", err);
        }
    },
        {
            scheduled: true,
            timezone: "Asia/Tashkent"
        }
    );

    async function checkTicket() {
        let models = await TicketModel.findAll({
            where: {
                date: { [Op.lte]: moment().format('YYYY-MM-DD HH:mm') }
            }
        });

        try {
            for (const element of models) {
                await element.destroy({ force: true });
            }
        } catch (error) {
            await TicketModel.destroy({
                where: {
                    date: { [Op.lte]: moment().format('YYYY-MM-DD HH:mm') }
                },
                force: true,
            });
        }

        return 'Data has been deleted'; // Return a value instead of sending the response directly
    }
}
