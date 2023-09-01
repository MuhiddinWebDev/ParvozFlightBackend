'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('client', [
            {
                phone: 998995160042,
                code: 123456,
                token: "new",
                lang: "uz",
                fullname: "Abdumalikov Dilshodjon"
            },
            {
                phone: 998995160062,
                code: 123456,
                token: "old",
                lang: "uz",
                fullname: "Abdumalikov Dilshodjon"
            },
            {
                phone: 9989951600,
                code: 123456,
                token: "old",
                lang: "uz",
                fullname: "Abdumalikov Dilshodjon"
            }
        ], {});

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('client', null, {});

    }
};
