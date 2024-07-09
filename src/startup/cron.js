const cron = require("node-cron");
const TicketModel = require("../models/tickets.model");
const WorkTable = require('../models/workTable.model');
const BannerModel = require("../models/banner.model")
const fs = require('fs');
const sequelize = require("../db/db-sequelize");
const moment = require('moment');
// const pathsss = require('../../uploads/image/')
const { Op } = require("sequelize");

module.exports = function executeTaskFromDatabase() {
    cron.schedule("*/30 * * * *", async () => {
        try {
            const result = await checkTicket();
            const work_result = await checkWorkTable();
        } catch (err) {
            console.error("Error executing task:", err);
        }
    },
        {
            scheduled: true,
            timezone: "Asia/Tashkent"
        }
    );

    async function checkWorkTable() {
        let models = await WorkTable.findAll({
            where: {
                end_date: { [Op.lte]: moment().unix() }
            }
        });

        try {
            for (const element of models) {
                element.finished = 'yes'
                element.save()
            }
        } catch (error) {
            for (const element of models) {
                element.finished = 'no'
                element.save()
            }
        }

        return 'Data has been deleted';
    }

    async function checkTicket() {
        let models = await TicketModel.findAll({
            where: {
                date: { [Op.lte]: moment().format('YYYY-MM-DD HH:mm') }
            }
        });

        try {
            for (const element of models) {
                await element.destroy();
            }
        } catch (error) {
            await TicketModel.destroy({
                where: {
                    date: { [Op.lte]: moment().format('YYYY-MM-DD HH:mm') }
                },
            });
        }

        return 'Data has been deleted'; // Return a value instead of sending the response directly
    }

    // async function deleteFileBanner() {
    //     const image_path = "./uploads/banner";
    //     try {
    //         const files = await fs.promises.readdir(image_path);

    //         const bannerPromises = files.map(async (file) => {
    //             const banner = await BannerModel.findOne({
    //                 where: { image: file }
    //             });
    //             return banner;
    //         });
    //         const banners = await Promise.all(bannerPromises);
    //         const filesToDelete = files.filter((file, index) => !banners[index]);

    //         for (const file of filesToDelete) {
    //             try {
    //                 await fs.unlink(`${image_path}/${file}`);
    //                 console.log(`Deleted file: ${file}`);
    //             } catch (err) {
    //                 console.error(`Error deleting file: ${file}`, err);
    //             }
    //         }
    //     } catch (err) {
    //         console.error('Error reading folder:', err);
    //     }
    // }



    // cron.schedule("*/30 * * * *", async () => {
    //     try {
    //         // const delete_file = await deleteFileBanner();

    //     } catch (err) {
    //         console.log('Error delete file', err)
    //     }
    // },
    //     {
    //         scheduled: true,
    //         timezone: "Asia/Tashkent"
    //     }
    // )
}
