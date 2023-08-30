'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('chat', [
            {
                datetime:"2022-01-04 11:57:59",
                order_id: 1,
                user_id: 1,
                text: "Comment"
            },
            {
                datetime:"2022-01-04 11:57:59",
                order_id: 1,
                user_id: 1,
                text: "Test uchun"
            },
            {
                datetime:"2022-01-04 11:57:59",
                order_id: 1,
                user_id: 1,
                text: "Ishladimi"
            }
        ], {});

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('chat', null, {});

    }
};
