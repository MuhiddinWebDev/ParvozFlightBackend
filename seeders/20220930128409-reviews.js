'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('reviews', [
            {
                rating: 5,
                name_uz: "Ali",
                name_ru: "Ali",
                name_ka: "Ali",
                comment_uz: "new",
                comment_ru: "new",
                comment_ka: "new",
                image: "123.jpg"
            },
            {
                rating: 4,
                name_uz: "Ali",
                name_ru: "Ali",
                name_ka: "Ali",
                comment_uz: "old",
                comment_ru: "old",
                comment_ka: "old",
                image: "123.jpg"
            },
            {
                rating: 3,
                name_uz: "Vali",
                name_ru: "Vali",
                name_ka: "Vali",
                comment_uz: "good",
                comment_ru: "good",
                comment_ka: "good",
                image: "123.jpg"
            }
        ], {});

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('reviews', null, {});

    }
};
