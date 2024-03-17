'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('menu_table', [
          {
            title: "Banner",
            icon: ' bx-notepad',
            name: "banner",
            status: true,
        },
        {
            title: "Xizmat turlari",
            icon: " bx-directions",
            name: "service-type",
            status: true,
        },
        {
            title: "Xizmatlar",
            icon: "bx bx-down-arrow-alt",
            name: "service",
            status: true,
        },
        {
            title: "Buyurtma berish",
            icon: "bx-cart-download",
            name: "Order",
            status: true,
        },
        {
            title: "Buyurtmalar",
            icon: "bx-table",
            name: "OrderList",
            status: true,
        },
        {
            title: "Agentlar",
            icon: "n-icon-agent",
            name: "promocode",
            status: true,
        },
        {
            title: "Foydalanuvchi",
            icon: "bxs-user-circle",
            name: "users",
            status: true,
        },
        {
            title: "Katigoriya",
            icon: "bx-bar-chart-square",
            name: "works",
            status: true,
        },
        {
            title: "Vakansiya",
            icon: "bx-sitemap",
            name: "Vakansiya",
            status: true,
        },
        {
            title: "Bron bilet",
            icon: "n-icon-agent",
            name: "booked-tickets",
            status: true,
        },
        {
            title: "Manzil bilet",
            icon: "TickIcon",
            name: "address-ticket",
            status: true,
        },
        {
            title: "Bilet",
            icon: "bxs-id-card",
            name: "Bilet",
            status: true,
        },
        {
            title: "Transport",
            icon: "bxs-truck",
            name: "Transport",
            status: true,
        },
        {
            title: "Manzil",
            icon: "bxs-map",
            name: "Manzil",
            status: true,
        },
        {
            title: "Uylar",
            icon: "bx-building-house",
            name: "houses",
            status: true,
        },
        {
            title: "Ijaraga uy",
            icon: "bxs-hotel",
            name: "Hotel",
            status: true,
        },
        {
            title: "Mijozlarimiz",
            icon: "bxs-group",
            name: "clients",
            status: true,
        },
    
        {
            title: "Mijozlarmiz fikri",
            icon: "bx-street-view",
            name: "reviews",
            status: true,
        },
        {
            title: "Suhbatlar",
            icon: "bxs-chat",
            name: "chat",
            status: true,
        },
        ], {});

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('menu_table', null, {});

    }
};
