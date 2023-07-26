'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {


        await queryInterface.bulkInsert('order', [
            {
                datetime: "2022-12-03 11:57:59",
                service_id: 1,
                client_id: 1,
                user_id: 0,
                status: "waiting"
            },
            {
                datetime: "2022-12-03 11:57:59",
                service_id: 1,
                client_id: 1,
                user_id: 0,
                status: "waiting"
            }
        ], {});


        await queryInterface.bulkInsert('order_steps_table', [
            {
                parent_id: 1,
                title_uz: "Hujjat toldirish",
                title_ru: "Hujjat toldirish",
                title_ka: "Hujjat toldirish",
                status: "active",
                comment_uz: "Ushbu bo`limda barcha malumotlarni to`liq kiriting",
                comment_ru: "Ushbu bo`limda barcha malumotlarni to`liq kiriting",
                comment_ka: "Ushbu bo`limda barcha malumotlarni to`liq kiriting",
                action: true,
                action_title_uz: "Malumotlarni yuborish",
                action_title_ru: "Malumotlarni yuborish",
                action_title_ka: "Malumotlarni yuborish",
                active: true,
                promocode: '',
                check_promocode: false,
                active_promocode: true
            },
            {
                parent_id: 1,
                title_uz: "Tekshirish",
                title_ru: "Tekshirish",
                title_ka: "Tekshirish",
                status: "waiting",
                comment_uz: "Ushbu bo`limda barcha malumotlaringiz tekshirilmoqda",
                comment_ru: "Ushbu bo`limda barcha malumotlaringiz tekshirilmoqda",
                comment_ka: "Ushbu bo`limda barcha malumotlaringiz tekshirilmoqda",
                action: false,
                action_title_uz: "",
                action_title_ru: "",
                action_title_ka: "",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 1,
                title_uz: "Qabul qilindi",
                title_ru: "Qabul qilindi",
                title_ka: "Qabul qilindi",
                status: "waiting",
                comment_uz: "Malumotlaringiz qabul qilindi",
                comment_ru: "Malumotlaringiz qabul qilindi",
                comment_ka: "Malumotlaringiz qabul qilindi",
                action: false,
                action_title_uz: "",
                action_title_ru: "",
                action_title_ka: "",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 1,
                title_uz: "Tolov",
                title_ru: "Tolov",
                title_ka: "Tolov",
                status: "waiting",
                comment_uz: "Ushbu bo`limda to`lov qilish uchun quyidagi raqamga murojaat qiling: 998 99 51600 62",
                comment_ru: "Ushbu bo`limda to`lov qilish uchun quyidagi raqamga murojaat qiling: 998 99 51600 62",
                comment_ka: "Ushbu bo`limda to`lov qilish uchun quyidagi raqamga murojaat qiling: 998 99 51600 62",
                action: false,
                action_title_uz: "",
                action_title_ru: "",
                action_title_ka: "",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 1,
                title_uz: "Tugatildi",
                title_ru: "Tugatildi",
                title_ka: "Tugatildi",
                status: "waiting",
                comment_uz: "Malumotlaringiz muvoffaqqiyatli qabul qilindi",
                comment_ru: "Malumotlaringiz muvoffaqqiyatli qabul qilindi",
                comment_ka: "Malumotlaringiz muvoffaqqiyatli qabul qilindi",
                action: false,
                action_title_uz: "",
                action_title_ru: "",
                action_title_ka: "",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 2,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                status: "waiting",
                comment_uz: "comment",
                comment_ru: "comment",
                comment_ka: "comment",
                action: true,
                action_title_uz: "action title",
                action_title_ru: "action title",
                action_title_ka: "action title",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 2,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                status: "active",
                comment_uz: "comment",
                comment_ru: "comment",
                comment_ka: "comment",
                action: true,
                action_title_uz: "action title",
                action_title_ru: "action title",
                action_title_ka: "action title",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 2,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                status: "done",
                comment_uz: "comment",
                comment_ru: "comment",
                comment_ka: "comment",
                action: true,
                action_title_uz: "action title",
                action_title_ru: "action title",
                action_title_ka: "action title",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 2,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                status: "waiting",
                comment_uz: "comment",
                comment_ru: "comment",
                comment_ka: "comment",
                action: true,
                action_title_uz: "action title",
                action_title_ru: "action title",
                action_title_ka: "action title",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 2,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                status: "active",
                comment_uz: "comment",
                comment_ru: "comment",
                comment_ka: "comment",
                action: true,
                action_title_uz: "action title",
                action_title_ru: "action title",
                action_title_ka: "action title",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 2,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                status: "done",
                comment_uz: "comment",
                comment_ru: "comment",
                comment_ka: "comment",
                action: true,
                action_title_uz: "action title",
                action_title_ru: "action title",
                action_title_ka: "action title",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 2,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                status: "waiting",
                comment_uz: "comment",
                comment_ru: "comment",
                comment_ka: "comment",
                action: true,
                action_title_uz: "action title",
                action_title_ru: "action title",
                action_title_ka: "action title",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 2,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                status: "active",
                comment_uz: "comment",
                comment_ru: "comment",
                comment_ka: "comment",
                action: true,
                action_title_uz: "action title",
                action_title_ru: "action title",
                action_title_ka: "action title",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            {
                parent_id: 2,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                status: "done",
                comment_uz: "comment",
                comment_ru: "comment",
                comment_ka: "comment",
                action: true,
                action_title_uz: "action title",
                action_title_ru: "action title",
                action_title_ka: "action title",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            }
        ], {});


        await queryInterface.bulkInsert('order_steps_fields_table', [
            {
                steps_parent_id: 1,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                type: "image",
                value: "value",
                column_status: true
            },
            {
                steps_parent_id: 1,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                type: "image",
                value: "value",
                column_status: true
            },
            {
                steps_parent_id: 2,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                type: "image",
                value: "value",
                column_status: true
            },
            {
                steps_parent_id: 3,
                title_uz: "title",
                title_ru: "title",
                title_ka: "title",
                type: "image",
                value: "value",
                column_status: true
            }
        ], {});

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('order', null, {});

    }
};
