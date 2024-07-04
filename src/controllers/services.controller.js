const ServicesModel = require('../models/services.model');
const ServicesStepsTableModel = require('../models/servicesStepsTable.model');
const StepsFieldsTableModel = require('../models/stepsFieldsTable.model');
const ServiceCategoryModel = require('../models/serviceCategory.model');
const ServicesCommentModel = require('../models/servicesComment.model')
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
const moment = require('moment');
const fs = require('fs');
/******************************************************************************
 *                              Services Controller
 ******************************************************************************/
class ServicesController extends BaseController {

    getAll = async (req, res, next) => {

        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';
        const category_id = req.query.category_id;
        let modelList = await ServicesModel.findAll({
            where: { category_id },
            attributes: [
                'id', 'icon', 'summa', 'comment_icon',
                [sequelize.literal(`name_${lang}`), 'name'],
                [sequelize.literal(`average_date_${lang}`), 'average_date'],
            ],
            include: [
                {
                    model: ServicesCommentModel,
                    as: 'service_comment',
                    attributes: ['icon',
                        [sequelize.literal(`comment_${lang}`), 'comment'],
                    ],
                    required: false,
                }
            ],
            order: [
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };

    getAllWeb = async (req, res, next) => {
        const service = await ServicesModel.findAll({
            // include: [
            //     {
            //         model: ServicesStepsTableModel,
            //         as: 'services_steps_table',
            //         required: false,
            //         include: [
            //             {
            //                 model: StepsFieldsTableModel,
            //                 as: 'steps_fields_table',
            //                 required: false

            //             }
            //         ]
            //     },
            //     {
            //         model: ServiceCategoryModel,
            //         as: 'service_category',
            //         required: false,
            //         attributes: ['id', 'k_name_uz']
            //     },
            // ],
        });

        if (!service) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(service);
    };


    getDetail = async (req, res, next) => {

        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        const service = await ServicesModel.findOne({
            attributes: [
                'id', 'icon', 'summa', 'comment_icon',
                [sequelize.literal(`name_${lang}`), 'name'],
                [sequelize.literal(`average_date_${lang}`), 'average_date'],
            ],
            include: [
                {
                    model: ServicesCommentModel,
                    as: 'service_comment',
                    attributes: ['icon',
                        [sequelize.literal(`comment_${lang}`), 'comment'],
                    ],
                    required: false,
                }
            ],
            where: { id: req.params.id }
        });

        if (!service) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(service);
    };


    getById = async (req, res, next) => {
        const service = await ServicesModel.findOne({
            where: { id: req.params.id },
            include: [
                // {
                //     model: ServicesStepsTableModel,
                //     as: 'services_steps_table',
                //     required: false,
                //     include: [
                //         {
                //             model: StepsFieldsTableModel,
                //             as: 'steps_fields_table',
                //             required: false

                //         }
                //     ],

                // },
                // {
                //     model: ServiceCategoryModel,
                //     as: 'service_category',
                //     required: false,
                //     attributes: ['id', 'k_name_uz']
                // },
                {
                    model: ServicesCommentModel,
                    as: 'service_comment',
                    required: false,
                }
            ],
        });

        if (!service) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(service);
    };

    uploadFile = async (req, res, next) => {
        let { icon } = req.body;

        try {
            if (!icon) {
                throw new HttpException(405, req.mf("icon type is invalid"));
            }

            const model = { icon: icon };
            res.send(model);
        } catch (error) {
            throw new HttpException(500, error.message);
        }
    };

    create = async (req, res, next) => {

        let { service_comment, services_steps_table, ...services } = req.body;
        const currentUser = req.currentUser;
        // let steps_fields_table = services_steps_table.steps_fields_table;

        let t = await sequelize.transaction()

        try {


            const model = await ServicesModel.create({
                category_id: services.category_id,
                name_uz: services.name_uz,
                name_ru: services.name_ru,
                name_ka: services.name_ka,
                average_date_uz: services.average_date_uz,
                average_date_ru: services.average_date_ru,
                average_date_ka: services.average_date_ka,
                icon: services.icon,
                comment_icon: services.comment_icon,
                comment_uz: services.comment_uz,
                comment_ru: services.comment_ru,
                comment_ka: services.comment_ka,
                title_uz: services.title_uz,
                title_ru: services.title_ru,
                title_ka: services.title_ka,
                summa: services.summa,
                discount_summa: services.discount_summa,
                user_id: currentUser.id
            }, { transaction: t });

            if (!model) {
                throw new HttpException(500, req.mf('Something went wrong'));
            }
            await this.#addRemoveComment(model.id, service_comment, false)
            // for (let i = 0; i < services_steps_table.length; i++) {
            //     let step_status = "waiting";
            //     let step_active = false;
            //     const element = services_steps_table[i];
            //     if (i == 0) {
            //         step_status = "active";
            //         step_active = true;
            //     }
            //     let model_table = await ServicesStepsTableModel.create({
            //         parent_id: model.id,
            //         title_uz: element.title_uz,
            //         title_ru: element.title_ru,
            //         title_ka: element.title_ka,
            //         status: step_status,
            //         comment_uz: element.comment_uz,
            //         comment_ru: element.comment_ru,
            //         comment_ka: element.comment_ka,
            //         action: element.action,
            //         action_title_uz: element.action_title_uz,
            //         action_title_ru: element.action_title_ru,
            //         action_title_ka: element.action_title_ka,
            //         active: step_active,
            //         active_promocode: element.active_promocode,
            //         promocode: '',
            //     }, { transaction: t });
            //     for (let j = 0; j < element.steps_fields_table.length; j++) {
            //         let elementx = element.steps_fields_table[j]
            //         // console.log(elementx.title_uz);
            //         if (element.action) {
            //             await StepsFieldsTableModel.create({
            //                 steps_parent_id: model_table.id,
            //                 title_uz: elementx.title_uz,
            //                 title_ru: elementx.title_ru,
            //                 title_ka: elementx.title_ka,
            //                 type: elementx.type,
            //                 value: ''
            //             }, { transaction: t });
            //         }
            //     }
            // }
            await t.commit();
            const modelx = await ServicesModel.findOne({
                where: { id: model.id },
                include: [
                    {
                        model: ServicesStepsTableModel,
                        as: 'services_steps_table',
                        required: false,
                        include: [
                            {
                                model: StepsFieldsTableModel,
                                as: 'steps_fields_table',
                                required: false

                            }
                        ],

                    },
                    {
                        model: ServiceCategoryModel,
                        as: 'service_category',
                        required: false,
                        attributes: ['id', 'k_name_uz']
                    }
                ],
            });

            res.send(modelx);
        } catch (error) {
            await t.rollback();
            throw new HttpException(500, error.message);
        }
    };


    update = async (req, res, next) => {

        let { service_comment, services_steps_table, ...services } = req.body;
        const model = await ServicesModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }


        let t = await sequelize.transaction()
        try {

            model.icon = services.icon
            model.comment_icon = services.comment_icon
            model.category_id = services.category_id;
            model.name_uz = services.name_uz;
            model.name_ru = services.name_ru;
            model.name_ka = services.name_ka;
            model.average_date_uz = services.average_date_uz;
            model.average_date_ru = services.average_date_ru;
            model.average_date_ka = services.average_date_ka;
            model.comment_uz = services.comment_uz;
            model.comment_ru = services.comment_ru;
            model.comment_ka = services.comment_ka;
            model.title_uz = services.title_uz;
            model.title_ru = services.title_ru;
            model.title_ka = services.title_ka;
            model.summa = services.summa;
            model.discount_summa = services.discount_summa;
            await model.save();

            await this.#deleteRelated(model.id);
            await this.#addRemoveComment(model.id, service_comment, true)


            // for (let i = 0; i < services_steps_table.length; i++) {
            //     const element = services_steps_table[i];

            //     let step_status = "waiting";
            //     let step_active = false;
            //     if (i == 0) {
            //         step_status = "active";
            //         step_active = true;
            //     }
            //     let model_table = await ServicesStepsTableModel.create({
            //         parent_id: model.id,
            //         title_uz: element.title_uz,
            //         title_ru: element.title_ru,
            //         title_ka: element.title_ka,
            //         status: step_status,
            //         comment_uz: element.comment_uz,
            //         comment_ru: element.comment_ru,
            //         comment_ka: element.comment_ka,
            //         action: element.action,
            //         active: step_active,
            //         action_title_uz: element.action_title_uz,
            //         action_title_ru: element.action_title_ru,
            //         action_title_ka: element.action_title_ka,
            //         active_promocode: element.active_promocode,
            //         promocode: '',
            //     }, { transaction: t });
            //     for (let j = 0; j < element.steps_fields_table.length; j++) {
            //         let elementx = element.steps_fields_table[j]
            //         // console.log(elementx.title);

            //         if (element.action == 1) {
            //             await StepsFieldsTableModel.create({
            //                 steps_parent_id: model_table.id,
            //                 title_uz: elementx.title_uz,
            //                 title_ru: elementx.title_ru,
            //                 title_ka: elementx.title_ka,
            //                 type: elementx.type,
            //                 value: ''
            //             }, { transaction: t });
            //         }
            //     }
            // }

            await t.commit();

            const modelx = await ServicesModel.findOne({
                where: { id: model.id },
                include: [
                    {
                        model: ServicesStepsTableModel,
                        as: 'services_steps_table',
                        required: false,
                        include: [
                            {
                                model: StepsFieldsTableModel,
                                as: 'steps_fields_table',
                                required: false

                            }
                        ],

                    },
                    {
                        model: ServiceCategoryModel,
                        as: 'service_category',
                        required: false,
                        attributes: ['id', 'k_name_uz']
                    }
                ],
            });


            res.send(modelx);
        } catch (error) {
            await t.rollback();
            throw new HttpException(500, error.message)
        }

    };


    delete = async (req, res, next) => {
        const model = await ServicesModel.findOne({ where: { id: req.params.id } })

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        try {
            await model.destroy({ force: true });
            await ServicesCommentModel.destroy({
                where: { service_id: req.params.id },
                force: true
            })
        } catch (error) {
            await model.destroy();
        }

        await this.#deleteBannerimg(model.icon);

        res.send(req.mf('data has been deleted'));
    };


    #deleteBannerimg = (icon) => {
        try {
            fs.unlinkSync('./uploads/icon/' + icon);
        } catch (error) {
            return 0;
        }
        return 1;
    }


    #deleteRelated = async (parent_id) => {
        let stepsModel = ServicesStepsTableModel.findAll({ where: { parent_id: parent_id } });

        if (stepsModel) {
            await ServicesStepsTableModel.destroy({
                where: { parent_id: parent_id },
                force: true
            }, { transaction: t });
           
            // for (let i = 0; i < stepsModel.length; i++) {

            //     await StepsFieldsTableModel.destroy({
            //         where: { steps_parent_id: stepsModel.id },
            //         force: true
            //     }, { transaction: t });

            // }
        }

    }

    #addRemoveComment = async (service_id, table, type) => {
        try {
            if (type) {
                await ServicesCommentModel.destroy({
                    where: { service_id: service_id },
                    force: true
                })
            }
            for (let i = 0; i < table.length; i++) {
                let el = table[i]
                await ServicesCommentModel.create({
                    service_id: service_id,
                    icon: el.icon,
                    comment_uz: el.comment_uz,
                    comment_ru: el.comment_ru,
                    comment_ka: el.comment_ka,
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ServicesController;