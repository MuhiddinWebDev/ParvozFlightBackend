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

        await queryInterface.bulkInsert('user_table', [
            {
              title: "Banner",
              icon: ' bx-notepad',
              name: "banner",
              status: true,
              user_id:1,
              menu_id:1,
          },
          {
              title: "Xizmat turlari",
              icon: " bx-directions",
              name: "service-type",
              status: true,
              user_id:1,
              menu_id:2,
          },
          {
              title: "Xizmatlar",
              icon: "bx bx-down-arrow-alt",
              name: "service",
              status: true,
              user_id:1,
              menu_id:3,
          },
          {
              title: "Buyurtma berish",
              icon: "bx-cart-download",
              name: "Order",
              status: true,
              user_id:1,
              menu_id:4,
          },
          {
              title: "Buyurtmalar",
              icon: "bx-table",
              name: "OrderList",
              status: true,
              user_id:1,
              menu_id:5,
          },
          {
              title: "Agentlar",
              icon: "n-icon-agent",
              name: "promocode",
              status: true,
              user_id:1,
              menu_id:6,
          },
          {
              title: "Foydalanuvchi",
              icon: "bxs-user-circle",
              name: "users",
              status: true,
              user_id:1,
              menu_id:7,
          },
          {
              title: "Katigoriya",
              icon: "bx-bar-chart-square",
              name: "works",
              status: true,
              user_id:1,
              menu_id:8,
          },
          {
              title: "Vakansiya",
              icon: "bx-sitemap",
              name: "Vakansiya",
              status: true,
              user_id:1,
              menu_id:9,
          },
          {
              title: "Bron bilet",
              icon: "n-icon-agent",
              name: "booked-tickets",
              status: true,
              user_id:1,
              menu_id:10,
          },
          {
              title: "Manzil bilet",
              icon: "TickIcon",
              name: "address-ticket",
              status: true,
              user_id:1,
              menu_id:11,
          },
          {
              title: "Bilet",
              icon: "bxs-id-card",
              name: "Bilet",
              status: true,
              user_id:1,
              menu_id:12,
          },
          {
              title: "Transport",
              icon: "bxs-truck",
              name: "Transport",
              status: true,
              user_id:1,
              menu_id:13,
          },
          {
              title: "Manzil",
              icon: "bxs-map",
              name: "Manzil",
              status: true,
              user_id:1,
              menu_id:14,
          },
          {
              title: "Uylar",
              icon: "bx-building-house",
              name: "houses",
              status: true,
              user_id:1,
              menu_id:15,
          },
          {
              title: "Ijaraga uy",
              icon: "bxs-hotel",
              name: "Hotel",
              status: true,
              user_id:1,
              menu_id:16,
          },
          {
              title: "Mijozlarimiz",
              icon: "bxs-group",
              name: "clients",
              status: true,
              user_id:1,
              menu_id:17,
          },
      
          {
              title: "Mijozlarmiz fikri",
              icon: "bx-street-view",
              name: "reviews",
              status: true,
              user_id:1,
              menu_id:18,
          },
          {
              title: "Suhbatlar",
              icon: "bxs-chat",
              name: "chat",
              status: true,
              user_id:1,
              menu_id:19,
          },
          ], {});
        
        await queryInterface.bulkInsert('bonus',[
            {
                summa:0
            }
        ], {})
    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('menu_table', null, {});

    }
};
