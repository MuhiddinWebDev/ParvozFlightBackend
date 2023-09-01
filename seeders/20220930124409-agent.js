'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('agent', [
        {
            id: 2,
            name: "Axborot agentligi",
            phone: "998995160062",
            code: "453534782"
        },
        {
            id: 1,
            name: "Davlat agentligi",
            phone: "998995160042",
            code: "634344990"
        }
        ], {});

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('agent', null, {});

    }
};
