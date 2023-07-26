'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.bulkInsert('services', [
            {
                name_uz: "Patent",
                name_ru: "Patent",
                name_ka: "Patent",
                average_date_uz: "5 kun",
                average_date_ru: "5 kun",
                average_date_ka: "5 kun",
                icon: "1.png",
                comment_uz: "Assalomu alaykum. ushbu patent servisida passport rasmingiz, INN raqamingiz, Promocodingiz va boshqa malumotlarni to`liq kiritishingiz kerak. Boshlash uchun pastdagi tugmani bosing!!!",
                comment_ru: "Assalomu alaykum. ushbu patent servisida passport rasmingiz, INN raqamingiz, Promocodingiz va boshqa malumotlarni to`liq kiritishingiz kerak. Boshlash uchun pastdagi tugmani bosing!!!",
                comment_ka: "Assalomu alaykum. ushbu patent servisida passport rasmingiz, INN raqamingiz, Promocodingiz va boshqa malumotlarni to`liq kiritishingiz kerak. Boshlash uchun pastdagi tugmani bosing!!!",
                summa: 200000,
                discount_summa: 200
            },

            {
                name_uz: "1 Yillik patent",
                name_ru: "Патент на 1 год",
                name_ka: "Патент на 1 год",
                average_date_uz: "3 kun",
                average_date_ru: "3 дня",
                average_date_ka: "3 дня",
                icon: "2.png",
                comment_uz: "<p>Ushbu patent uchun quyidagi hujjatlar talab qilinadi:</p><ol><i>Pasport rasmi</i><li>Ishlash joyidan malumotnoma</li><li>Shaxsiy rasmingiz</li><li>Sug'urta raqami</li></ol><p>Hujjatlar to'ldirilgandan keyin 1 ish kuni davomida ko'rib chiqiladi va hodimlarimizi siz bilan bog'lanadi.</p><p>Hizmat narxi 500 RUB</p><p>agar bizning hamkorimizdan olingan QR kodiz bo'lsa 100 RUB chegirmaga ega bo'lasiz.</p>",
                comment_ru: "<p>Для этого патента необходимы следующие документы:</p><p><br></p><p>Паспортное фото</p><p>Справка с рабочего места</p><p>Ваше личное фото</p><p>Номер страховки</p><p>Документы будут рассмотрены в течение 1 рабочего дня и наши сотрудники свяжутся с вами.</p><p><br></p><p>Стоимость услуги 500 руб.</p><p><br></p><p>при наличии QR-кода от нашего партнера вы получите скидку 100 руб.</p>",
                comment_ka: "<p>Для этого патента необходимы следующие документы:</p><p><br></p><p>Паспортное фото</p><p>Справка с рабочего места</p><p>Ваше личное фото</p><p>Номер страховки</p><p>Документы будут рассмотрены в течение 1 рабочего дня и наши сотрудники свяжутся с вами.</p><p><br></p><p>Стоимость услуги 500 руб.</p><p><br></p><p>при наличии QR-кода от нашего партнера вы получите скидку 100 руб.</p>",
                summa: 2500,
                discount_summa: 100,
            }
        ], {});


        await queryInterface.bulkInsert('services_steps_table', [
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
                title_uz: "Patent nomi",
                title_ru: "Patent nomi",
                title_ka: "Patent nomi",
                status: "waiting",
                comment_uz: "Patentingiz uchun nom bering",
                comment_ru: "Patentingiz uchun nom bering",
                comment_ka: "Patentingiz uchun nom bering",
                action: true,
                action_title_uz: "Malumotlarni saqlash",
                action_title_uz: "Malumotlarni saqlash",
                action_title_uz: "Malumotlarni saqlash",
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
                action: true,
                action_title_uz: "Izohingizni yuboring",
                action_title_ru: "Izohingizni yuboring",
                action_title_ka: "Izohingizni yuboring",
                active: false,
                promocode: '',
                check_promocode: false,
                active_promocode: false
            },
            // patent id 2
            {
                parent_id: 2,
                title_uz: "Hujjatlarni to'ldirish",
                title_ru: "Заполнение документов",
                title_ka: "Заполнение документов",
                promocode: "",
                check_promocode: false,
                active_promocode: true,
                status: "active",
                comment_uz: "<h3>Ush qadamdan barcha hujjatlariz so'raladi. Maydonlarni to'ldirib \"Yuborish\" tugmasini bosing va operatorlarimiz javobini kuting.</h3><p><br></p>",
                comment_ru: "<p>На этом этапе запрашиваются все документы. Заполните поля, нажмите «Отправить» и дождитесь ответа наших операторов.</p>",
                comment_ka: "<p>На этом этапе запрашиваются все документы. Заполните поля, нажмите «Отправить» и дождитесь ответа наших операторов.</p>",
                action: true,
                action_title_uz: "Yuborish",
                action_title_ru: "Отправка",
                action_title_ka: "Отправка",
                active: true
            },
            {
                parent_id: 2,
                title_uz: "To'lov qilish",
                title_ru: "Оплата",
                title_ka: "Оплата",
                promocode: "",
                check_promocode: false,
                active_promocode: false,
                status: "waiting",
                comment_uz: "<p>Ushbu qadamda sizdan operatorlarizmi taqdim etgan kartaga to'lov qilish so'raladi.</p>",
                comment_ru: "<p>На этом этапе вам будет предложено произвести оплату на карту, предоставленную вашим оператором связи.</p>",
                comment_ka: "<p>На этом этапе вам будет предложено произвести оплату на карту, предоставленную вашим оператором связи.</p>",
                action: false,
                action_title_uz: "1",
                action_title_ru: "1",
                action_title_ka: "1",
                active: false,
            },
            {
                parent_id: 2,
                title_uz: "Hujjatlarni tayyorlash",
                title_ru: "Подготовка документов",
                title_ka: "Подготовка документов",
                promocode: "",
                check_promocode: false,
                active_promocode: false,
                status: "waiting",
                comment_uz: "<p>Ushbu bosqichda hujjatlaringiz bizning hodimlar tarafidan tayyorlanadi va davlat idoralariga yuboriladi. Davlat o'rganlari sizning hujjatlaringizni tayyor qilgach operatorlarimiz siz bilan bog'lanadi.</p>",
                comment_ru: "<p>На этом этапе ваши документы будут подготовлены нашими сотрудниками и отправлены в государственные органы. Наши операторы свяжутся с вами после того, как государственные органы подготовят ваши документы.</p>",
                comment_ka: "<p>На этом этапе ваши документы будут подготовлены нашими сотрудниками и отправлены в государственные органы. Наши операторы свяжутся с вами после того, как государственные органы подготовят ваши документы.</p>",
                action: false,
                action_title_uz: "1",
                action_title_ru: "1",
                action_title_ka: "1",
                active: false
            },
            {
                parent_id: 2,
                title_uz: "Tugatildi!",
                title_ru: "Законченный!",
                title_ka: "Законченный!",
                promocode: "",
                check_promocode: false,
                active_promocode: false,
                status: "waiting",
                comment_uz: "<h1>Hujjatlaringiz tayyor!</h1><p>Hujjatlaringizni bizning operatorlardan qabul qilib olishingiz mumkun!</p><h1>+998901648595</h1><p><br></p>",
                comment_ru: "<p>Ваши документы готовы!</p><p>Вы можете получить документы у наших операторов!</p><p><br></p><p>+998901648595</p>",
                comment_ka: "<p>Ваши документы готовы!</p><p>Вы можете получить документы у наших операторов!</p><p><br></p><p>+998901648595</p>",
                action: false,
                action_title_uz: "1",
                action_title_ru: "1",
                action_title_ka: "1",
                active: false
            }

        ], {});


        await queryInterface.bulkInsert('steps_fields_table', [
            {
                steps_parent_id: 1,
                title_uz: "Passport rasm",
                title_ru: "Passport rasm",
                title_ka: "Passport rasm",
                type: "image",
                value: "",
                column_status: true
            },
            {
                steps_parent_id: 1,
                title_uz: "INN pdf holatida",
                title_ru: "INN pdf holatida",
                title_ka: "INN pdf holatida",
                type: "file",
                value: "",
                column_status: true
            },
            {
                steps_parent_id: 1,
                title_uz: "Tug`ilgan kuningiz",
                title_ru: "Tug`ilgan kuningiz",
                title_ka: "Tug`ilgan kuningiz",
                type: "date",
                value: "",
                column_status: true
            },
            {
                steps_parent_id: 1,
                title_uz: "Qo`shimcha telefon raqam",
                title_ru: "Qo`shimcha telefon raqam",
                title_ka: "Qo`shimcha telefon raqam",
                type: "number",
                value: "",
                column_status: true
            },
            {
                steps_parent_id: 1,
                title_uz: "Izoh",
                title_ru: "Izoh",
                title_ka: "Izoh",
                type: "text",
                value: "",
                column_status: true
            },
          
            {
                steps_parent_id: 2,
                title_uz: "Patentingiz nomini kiriting",
                title_ru: "Patentingiz nomini kiriting",
                title_ka: "Patentingiz nomini kiriting",
                type: "text",
                value: "",
                column_status: true
            },
          
            {
                steps_parent_id: 3,
                title_uz: "Fikringizni yozib qoldiring",
                title_ru: "Fikringizni yozib qoldiring",
                title_ka: "Fikringizni yozib qoldiring",
                type: "text",
                value: "",
                column_status: true
            }

        ], {});


        await queryInterface.bulkInsert('steps_fields_table', [
            {
                steps_parent_id: 4,
                title_uz: "Pasport rasm",
                title_ru: "Паспортное фото",
                title_ka: "Паспортное фото",
                type: "image",
                value: "",
                column_status: true
            },
            {
                steps_parent_id: 4,
                title_uz: "Sug'urta raqami",
                title_ru: "Номер страховки",
                title_ka: "Номер страховки",
                type: "number",
                value: "",
                column_status: true
            },
            {
                steps_parent_id: 4,
                title_uz: "Telefon raqam",
                title_ru: "Номер телефона",
                title_ka: "Номер телефона",
                type: "text",
                value: "",
                column_status: true
            }
        ], {});

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('services', null, {});

    }
};
