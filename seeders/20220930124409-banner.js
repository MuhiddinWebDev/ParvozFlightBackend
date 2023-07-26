'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('banner', [
            {
                description_uz: "Ali",
                description_ru: "Ali",
                description_ka: "Ali",
                url: "new",
                image: "1.jpg"
            },
            {
                description_uz: "Ali",
                description_ru: "Ali",
                description_ka: "Ali",
                url: "new",
                image: "2.jpg"
            },
            {
                description_uz: "Ali",
                description_ru: "Ali",
                description_ka: "Ali",
                url: "new",
                image: "3.jpg"
            }
        ], {});

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('banner', null, {});

    }
};
