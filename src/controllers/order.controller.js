const OrderModel = require('../models/order.model');
const ClientModel = require('../models/client.model');
const ServicesModel = require('../models/services.model');
const ServicesStepsTableModel = require('../models/servicesStepsTable.model');
const StepsFieldsTableModel = require('../models/stepsFieldsTable.model');
const OrderStepsTableModel = require('../models/orderStepsTable.model');
const OrderStepsFieldsTableModel = require('../models/orderStepsFieldsTable.model');
const AgentModel = require('../models/agent.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
const moment = require('moment');
const fs = require('fs');
const { web } = require('webpack');
const { Op } = require("sequelize");
/******************************************************************************
 *                              Order Controller
 ******************************************************************************/
class OrderController extends BaseController {
    
    getAll = async (req, res, next) => {

        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';
        let body = req.body;
        let start_date = body.start_date;
        let end_date = body.end_date;
        let agent_id = body.agent_id;
        let query = {};

        query.datetime =  {
            [Op.gte]: start_date,
            [Op.lte]: end_date,
        };

        if(agent_id != "" && agent_id > 0) query.agent_id = agent_id;
        
        let modelList = await OrderModel.findAll({
            attributes: [
                'id', 'datetime', 'service_id', 'agent_id', 'client_id', 'user_id', 'pay_user_id', 'pay_status', 'status', 'summa', 'discount_summa','step_status','step_title',
                [ sequelize.literal(`OrderModel.comment_${lang}`), 'comment' ],
            ],
            where : query,
            include: [
                {
                    model: ClientModel,
                    as: 'client',
                    required: false

                },
                {
                    model: AgentModel,
                    as: 'agent',
                    required: false

                },
                {
                    model: ServicesModel,
                    attributes: [
                        'id', 'icon', 'summa',
                        [ sequelize.literal(`services.name_${lang}`), 'name' ],
                        [ sequelize.literal(`average_date_${lang}`), 'average_date' ],
                        [ sequelize.literal(`services.comment_${lang}`), 'comment' ],
                    ],
                    as: 'services',
                    required: false

                },
                {
                    model: OrderStepsTableModel,
                    attributes: [
                        'id', 'parent_id', 'promocode', 'check_promocode', 'active_promocode', 'status', 'action', 'active',
                        [ sequelize.literal(`action_title_${lang}`), 'action_title' ],
                        [ sequelize.literal(`order_steps_table.title_${lang}`), 'title' ],
                        [ sequelize.literal(`order_steps_table.comment_${lang}`), 'comment' ],
                    ],
                    as: 'order_steps_table',
                    required: false,
                    include: [
                        {
                            model: OrderStepsFieldsTableModel,
                            attributes: [
                                'id', 'steps_parent_id', 'type', 'value', 'column_status',
                                [ sequelize.literal(`\`order_steps_table->order_steps_fields_table\`.title_${lang}`), 'title' ]
                            ],
                            as: 'order_steps_fields_table',
                            required: false
                        }
                    ],
                }
            ],
            order: [
                ['id', 'ASC']
            ]
        });

        res.send(modelList);
    };


    // Clientlarning orderlarini chiqarib berish uchun
    getAllByClient = async (req, res, next) => {

        const client_id = req.currentClient.id;

        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';

        // let t = await sequelize.transaction()

        // try {

            let modelList = await OrderModel.findAll({
                where: { client_id: client_id },
                attributes: [
                    'id', 'datetime', 'service_id', 'client_id', 'user_id', 'pay_user_id', 'pay_status', 'status', 'summa', 'discount_summa',
                    [ sequelize.literal(`OrderModel.comment_${lang}`), 'comment' ],
                ],
                include: [
                    {
                        model: ClientModel,
                        as: 'client',
                        required: false
    
                    },
                    {
                        model: ServicesModel,
                        attributes: [
                            'id', 'icon', 'summa',
                            [ sequelize.literal(`services.name_${lang}`), 'name' ],
                            [ sequelize.literal(`average_date_${lang}`), 'average_date' ],
                            [ sequelize.literal(`services.comment_${lang}`), 'comment' ],
                        ],
                        as: 'services',
                        required: false
    
                    },
                    {
                        model: OrderStepsTableModel,
                        attributes: [
                            'id', 'parent_id', 'promocode', 'check_promocode', 'active_promocode', 'status', 'action', 'active',
                            [ sequelize.literal(`action_title_${lang}`), 'action_title' ],
                            [ sequelize.literal(`order_steps_table.title_${lang}`), 'title' ],
                            [ sequelize.literal(`order_steps_table.comment_${lang}`), 'comment' ],
                        ],
                        as: 'order_steps_table',
                        required: false,
                        include: [
                            {
                                model: OrderStepsFieldsTableModel,
                                attributes: [
                                    'id', 'steps_parent_id', 'type', 'value', 'column_status',
                                    [ sequelize.literal(`\`order_steps_table->order_steps_fields_table\`.title_${lang}`), 'title' ]
                                ],
                                as: 'order_steps_fields_table',
                                required: false
                            }
                        ],
                    }
                ],
                order: [
                    ['id', 'ASC']
                ]
            });
            // await t.commit();
            res.send(modelList);
        // } catch (error) {
        //     // await t.rollback();
        //     throw new HttpException(500, req.mf('Something went wrong'));
        // }
    };


    // Clientlarning orderlarini chiqarib berish uchun
    unfinishedOrdersByClient = async (req, res, next) => {

        const client_id = req.currentClient.id;

        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';

        // let t = await sequelize.transaction()

        try {

            let modelList = await OrderModel.findAll({
                where: { client_id: client_id, status: "waiting" },
                attributes: [
                    'id', 'datetime', 'service_id', 'client_id', 'user_id', 'pay_user_id', 'pay_status', 'status', 'summa', 'discount_summa',
                    [ sequelize.literal(`OrderModel.comment_${lang}`), 'comment' ],
                ],
                include: [
                    {
                        model: ClientModel,
                        as: 'client',
                        required: false
    
                    },
                    {
                        model: ServicesModel,
                        attributes: [
                            'id', 'icon', 'summa',
                            [ sequelize.literal(`services.name_${lang}`), 'name' ],
                            [ sequelize.literal(`average_date_${lang}`), 'average_date' ],
                            [ sequelize.literal(`services.comment_${lang}`), 'comment' ],
                        ],
                        as: 'services',
                        required: false
    
                    },
                    {
                        model: OrderStepsTableModel,
                        attributes: [
                            'id', 'parent_id', 'promocode', 'check_promocode', 'active_promocode', 'status', 'action', 'active',
                            [ sequelize.literal(`action_title_${lang}`), 'action_title' ],
                            [ sequelize.literal(`order_steps_table.title_${lang}`), 'title' ],
                            [ sequelize.literal(`order_steps_table.comment_${lang}`), 'comment' ],
                        ],
                        as: 'order_steps_table',
                        required: false,
                        include: [
                            {
                                model: OrderStepsFieldsTableModel,
                                attributes: [
                                    'id', 'steps_parent_id', 'type', 'value', 'column_status',
                                    [ sequelize.literal(`\`order_steps_table->order_steps_fields_table\`.title_${lang}`), 'title' ]
                                ],
                                as: 'order_steps_fields_table',
                                required: false
                            }
                        ],
                    }
                ],
                order: [
                    ['id', 'ASC']
                ]
            });
            // await t.commit();
            res.send(modelList);
        } catch (error) {
            // await t.rollback();
            throw new HttpException(500, req.mf('Something went wrong '));
        }
    };


    getById = async (req, res, next) => {

        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';

        const order = await OrderModel.findOne({
            where: { id: req.params.id },
            attributes: [
                'id', 'datetime', 'service_id', 'client_id', 'user_id', 'pay_user_id', 'pay_status', 'status', 'summa', 'discount_summa',
                [ sequelize.literal(`OrderModel.comment_${lang}`), 'comment' ],
            ],
            include: [
                {
                    model: ClientModel,
                    as: 'client',
                    required: false

                },
                {
                    model: ServicesModel,
                    attributes: [
                        'id', 'icon', 'summa',
                        [ sequelize.literal(`services.name_${lang}`), 'name' ],
                        [ sequelize.literal(`average_date_${lang}`), 'average_date' ],
                        [ sequelize.literal(`services.comment_${lang}`), 'comment' ],
                    ],
                    as: 'services',
                    required: false

                },
                {
                    model: OrderStepsTableModel,
                    attributes: [
                        'id', 'parent_id', 'promocode', 'check_promocode', 'active_promocode', 'status', 'action', 'active',
                        [ sequelize.literal(`action_title_${lang}`), 'action_title' ],
                        [ sequelize.literal(`order_steps_table.title_${lang}`), 'title' ],
                        [ sequelize.literal(`order_steps_table.comment_${lang}`), 'comment' ],
                    ],
                    as: 'order_steps_table',
                    required: false,
                    include: [
                        {
                            model: OrderStepsFieldsTableModel,
                            attributes: [
                                'id', 'steps_parent_id', 'type', 'value', 'column_status',
                                [ sequelize.literal(`\`order_steps_table->order_steps_fields_table\`.title_${lang}`), 'title' ]
                            ],
                            as: 'order_steps_fields_table',
                            required: false
    
                        }
                    ],

                }
            ],
        });

        if (!order) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(order);
    };


    getStepAction = async (req, res, next) => {

        let { step_id, request_id } = req.body;
        let { ...fields } = req.body.fields;
       
        

        let t = await sequelize.transaction()

        try {

            const order = await OrderModel.findOne({
                where: { id: request_id }
            });
    
            if (!order) {
                throw new HttpException(404, req.mf('data not found'));
            }

            const order_step = await OrderStepsTableModel.findOne({
                where: { id: step_id, parent_id: request_id}
            });
    
            if (!order_step) {
                throw new HttpException(404, req.mf('data not found'));
            }


            for (let i = 0; i < req.body.fields.length; i++) {
            //     console.log('asdfg');
               const field = fields[i];
            //    console.log('test');
            //    console.log(fields);
            //    console.log(field.value);
               

               const order_step_field = await OrderStepsFieldsTableModel.findOne({
                   where: { id: field.id, steps_parent_id: step_id }
               });
       
               if (!order_step_field) {
                   throw new HttpException(404, req.mf('data not found'));
               }
   
               order_step_field.value = field.value;
               await order_step_field.save();
            }

            await t.commit();
            const modelx = await OrderModel.findOne({
                where: { id: request_id },
                include: [
                    {
                        model: ServicesModel,
                        as: 'services',
                        required: false
    
                    },
                    {
                        model: OrderStepsTableModel,
                        as: 'order_steps_table',
                        required: false,
                        include: [
                            {
                                model: OrderStepsFieldsTableModel,
                                as: 'order_steps_fields_table',
                                required: false
        
                            }
                        ],
    
                    }
                ],
            });
            res.send(modelx);
        } catch (error) {
            await t.rollback();
            throw new HttpException(500, error.message);
        }
    };


    // for mobile
    getSendFields = async (req, res, next) => {

        let { step_id, promocode, request_id } = req.body;
        let { ...fields } = req.body.fields;
        // console.log('test');
        // console.log(req.body);
        // console.log(fields);

        let t = await sequelize.transaction()
        const order = await OrderModel.findOne({
            where: { id: request_id }
        });

        if (!order) {
            throw new HttpException(500, req.mf('order not found'));
        }

        if(promocode != '' && (promocode) && promocode.length >= 8){
            var promocod_model = await AgentModel.findOne({where: { code: promocode } });

            if (!promocod_model) {
                throw new HttpException(500, req.mf('promocod not found'));
            }
        }

        try {

            var services = await ServicesModel.findOne({where: { id: order.service_id } });
        
            if (!services) {
                throw new HttpException(500, req.mf('data not found'));
            }

            const order_step = await OrderStepsTableModel.findOne({
                where: { id: step_id, parent_id: request_id }
            });
    
            if (!order_step) {
                throw new HttpException(500, req.mf('order_step not found'));
            }
            // console.log('status ', order_step.status);
            
            if(order_step.status == "active"){
                // console.log('status promocode', promocode);
                if(order_step.check_promocode == 0 && promocod_model && promocode.length >= 8){
                    console.log('status ', promocode);
                    order.discount_summa = services.discount_summa;
                    order.agent_id = promocod_model.id;
                    order_step.promocode = promocode;
                    order_step.check_promocode = true;
                }
                order.step_status = "checking";
                order.step_title = order_step.title_uz;
                order_step.status = "checking";
                order_step.active = false;
                await order.save();
                await order_step.save();

                for (let i = 0; i < req.body.fields.length; i++) {
                   const field = fields[i];
                //    console.log('test');
                //    console.log(fields);
                //    console.log(field.value);
                   
                   const order_step_field = await OrderStepsFieldsTableModel.findOne({
                       where: { id: field.id, steps_parent_id: step_id }
                   });
           
                   if (!order_step_field) {
                       throw new HttpException(500, req.mf('order_step_fields not found'));
                   }
       
                   order_step_field.value = field.value;
                   order_step_field.column_status = true;
                   await order_step_field.save();
                }
            }


            await t.commit();

            let lang = req.get('Accept-Language');
            lang = lang? lang: 'uz';
    
            const modelx = await OrderModel.findOne({
                where: { id: request_id },
                attributes: [
                    'id', 'datetime', 'service_id', 'client_id', 'user_id', 'pay_user_id', 'pay_status', 'status', 'summa', 'discount_summa',
                    [ sequelize.literal(`OrderModel.comment_${lang}`), 'comment' ],
                ],
                include: [
                    {
                        model: ClientModel,
                        as: 'client',
                        required: false
    
                    },
                    {
                        model: ServicesModel,
                        attributes: [
                            'id', 'icon', 'summa',
                            [ sequelize.literal(`services.name_${lang}`), 'name' ],
                            [ sequelize.literal(`average_date_${lang}`), 'average_date' ],
                            [ sequelize.literal(`services.comment_${lang}`), 'comment' ],
                        ],
                        as: 'services',
                        required: false
    
                    },
                    {
                        model: OrderStepsTableModel,
                        attributes: [
                            'id', 'parent_id', 'promocode', 'check_promocode', 'active_promocode', 'status', 'action', 'active',
                            [ sequelize.literal(`action_title_${lang}`), 'action_title' ],
                            [ sequelize.literal(`order_steps_table.title_${lang}`), 'title' ],
                            [ sequelize.literal(`order_steps_table.comment_${lang}`), 'comment' ],
                        ],
                        as: 'order_steps_table',
                        required: false,
                        include: [
                            {
                                model: OrderStepsFieldsTableModel,
                                attributes: [
                                    'id', 'steps_parent_id', 'type', 'value', 'column_status',
                                    [ sequelize.literal(`\`order_steps_table->order_steps_fields_table\`.title_${lang}`), 'title' ]
                                ],
                                as: 'order_steps_fields_table',
                                required: false
        
                            }
                        ],
                    }
                ],
            });
            res.send(modelx);
        } catch (error) {
            await t.rollback();
            throw new HttpException(500, error.message);
        }
    };


    // for web
    sendFields = async (req, res, next) => {

        let { step_id, request_status, step_status, request_id, promocode } = req.body;
        let { ...fields } = req.body.fields;

        const order = await OrderModel.findOne({
            where: { id: request_id }
        });

        if (!order) {
            throw new HttpException(404, req.mf('data not found'));
        }

        if(promocode){
            var promocod_model = await AgentModel.findOne({where: { code: promocode }
            });

            if (!promocod_model) {
                throw new HttpException(500, req.mf('promocod not found'));
            }
        }

        try {

            var services = await ServicesModel.findOne({where: { id: order.service_id } });
        
            if (!services) {
                throw new HttpException(500, req.mf('data not found'));
            }

            const order_step = await OrderStepsTableModel.findOne({
                where: { id: step_id, parent_id: request_id }
            });
    
            if (!order_step) {
                throw new HttpException(404, req.mf('data not found'));
            }
            
            if(order_step.active_promocode && promocod_model){
                if(order_step.check_promocode == 0 && promocod_model.code == promocode){
                    order.discount_summa = services.discount_summa;
                    order.agent_id = promocod_model.id;
                    order_step.promocode = promocode;
                    order_step.check_promocode = true;
                }
            }

            order.step_status = "checking";
            order.step_title = order_step.title_uz;
            if (request_status) {
                order.status = request_status;
            }

            if(order_step.status == "active" && step_status == "active"){
                order_step.status = "checking";
                order_step.active = false;
            }

            await order.save();
            await order_step.save();

            for (let i = 0; i < req.body.fields.length; i++) {

               const field = fields[i];

               const order_step_field = await OrderStepsFieldsTableModel.findOne({
                   where: { id: field.id, steps_parent_id: step_id }
               });
       
               if (!order_step_field) {
                   throw new HttpException(404, req.mf('data not found'));
               }

               if(field.column_status == false){
                    
                    let client = await ClientModel.findOne({
                        where: { id: order.client_id }
                    });
                    let order_step_title = order_step.title_uz;
                    if(client.lang == "ru"){
                        order_step_title = order_step.title_ru;
                    }
                    if(client.lang == "ka"){
                        order_step_title = order_step.title_ka;
                    }

                    let fcm_token = client.fcm_token;
                    let title = order_step_title + ' ' + req.mf('bolimida') + ' ' + order_step_field.type + ' ' + req.mf('qatordagi malumot xato');
                    // let title = order_step.title_uz + " bo`limida " + order_step_field.type + " qatoridagi ma`lumot xato kiritilgan!!!";
                    let type = "order";
                    
                    var message = {
                        to: fcm_token,
                        notification:{
                            title: title,
                            body: field.id,
                            type: type,
                            data: order.id
                        }
                    };
                    // console.log('message ', message);
                    await this.notification(message);  
               }
   
               order_step_field.value = field.value;
               order_step_field.column_status = field.column_status;
               await order_step_field.save();
            }
    
            const modelx = await OrderModel.findOne({
                where: { id: request_id },
                include: [
                    {
                        model: ClientModel,
                        as: 'client',
                        required: false
    
                    },
                    {
                        model: ServicesModel,
                        as: 'services',
                        required: false
    
                    },
                    {
                        model: OrderStepsTableModel,
                        as: 'order_steps_table',
                        required: false,
                        include: [
                            {
                                model: OrderStepsFieldsTableModel,
                                as: 'order_steps_fields_table',
                                required: false
        
                            }
                        ],
                    }
                ],
            });
            res.send(modelx);
        } catch (error) {
            throw new HttpException(500, error.message);
        }
    };


    // for web
    sendFieldsUpdate = async (req, res, next) => {

        let { step_id, request_status, step_status, request_id, promocode } = req.body;
        let { ...fields } = req.body.fields;

        const order = await OrderModel.findOne({
            where: { id: request_id }
        });

        if (!order) {
            throw new HttpException(404, req.mf('data not found'));
        }

        if(promocode && promocode.length >= 8){
            var promocod_model = await AgentModel.findOne({where: { code: promocode }
            });

            if (!promocod_model) {
                throw new HttpException(500, req.mf('promocod not found'));
            }
        }

        try {

            var services = await ServicesModel.findOne({where: { id: order.service_id } });
        
            if (!services) {
                throw new HttpException(500, req.mf('data not found'));
            }

            const order_step = await OrderStepsTableModel.findOne({
                where: { id: step_id, parent_id: request_id }
            });
    
            if (!order_step) {
                throw new HttpException(404, req.mf('data not found'));
            }
            
            if(order_step.status != step_status){
                // let step_lang_status = 'Faol';
                let client = await ClientModel.findOne({
                    where: { id: order.client_id }
                });
                let order_step_title = order_step.title_uz;
                if(client.lang == "ru"){
                    order_step_title = order_step.title_ru;
                }
                if(client.lang == "ka"){
                    order_step_title = order_step.title_ka;
                }
                let fcm_token = client.fcm_token;
                let title = order_step_title + ' ' + req.mf('holati ozgardi'); //+ step_lang_status;
                let type = "order";

                var message = {
                    to: fcm_token,
                    notification:{
                        title: title,
                        body: order_step.id,
                        type: type,
                        data: order.id
                    }
                };
                // console.log('message ', message);
                await this.notification(message);                  
            }

            if(order_step.active_promocode && promocod_model && promocode.length >= 8){
                if(order_step.check_promocode == 0 && promocod_model.code == promocode){
                    order.discount_summa = services.discount_summa;
                    order.agent_id = promocod_model.id;
                    order_step.promocode = promocode;
                    order_step.check_promocode = true;
                    await order.save();
                }
            }

            if (request_status) {
                order.status = request_status;
            }

            if(step_status == "active"){
                order_step.status = "active";
                order_step.active = true;
            }else if(step_status == "done"){
                order_step.status = "done";
                order_step.active = false;
            }else if(step_status == "waiting"){
                order_step.status = "waiting";
                order_step.active = false;
            }else if(step_status == "checking"){
                order_step.status = "checking";
                order_step.active = false;
            }
            order.step_status = step_status;
            order.step_title = order_step.title_uz;

            await order.save();
            await order_step.save();

            for (let i = 0; i < req.body.fields.length; i++) {

               const field = fields[i];

               const order_step_field = await OrderStepsFieldsTableModel.findOne({
                   where: { id: field.id, steps_parent_id: step_id }
               });
       
               if (!order_step_field) {
                   throw new HttpException(404, req.mf('data not found'));
               }

               if(field.column_status == false){
                    
                    let client = await ClientModel.findOne({
                        where: { id: order.client_id }
                    });
                    let order_step_title = order_step.title_uz;
                    if(client.lang == "ru"){
                        order_step_title = order_step.title_ru;
                    }
                    if(client.lang == "ka"){
                        order_step_title = order_step.title_ka;
                    }

                    let fcm_token = client.fcm_token;
                    let title = order_step_title + ' ' + req.mf('bolimida') + ' ' + order_step_field.type + ' ' + req.mf('qatordagi malumot xato');
                    let type = "order";
                    
                    var message = {
                        to: fcm_token,
                        notification:{
                            title: title,
                            body: field.id,
                            type: type,
                            data: order.id
                        }
                    };
                    // console.log('message ', message);
                    await this.notification(message);  
               }
   
               order_step_field.value = field.value;
               order_step_field.column_status = field.column_status;
               await order_step_field.save();
            }
    
            const modelx = await OrderModel.findOne({
                where: { id: request_id },
                include: [
                    {
                        model: ClientModel,
                        as: 'client',
                        required: false
    
                    },
                    {
                        model: ServicesModel,
                        as: 'services',
                        required: false
    
                    },
                    {
                        model: OrderStepsTableModel,
                        as: 'order_steps_table',
                        required: false,
                        include: [
                            {
                                model: OrderStepsFieldsTableModel,
                                as: 'order_steps_fields_table',
                                required: false
        
                            }
                        ],
                    }
                ],
            });
            res.send(modelx);
        } catch (error) {
            throw new HttpException(500, error.message);
        }
    };


    getUploadImage = async (req, res, next) => {

        let { image } = req.body;

        try {

            if (!image) {
                throw new HttpException(500, 'image type is invalid');
            }
            const name = {
                image_name: image
            };

            res.send(name);
        } catch (error) {
            throw new HttpException(500, error.message);
        }
    };


    getUploadFile = async (req, res, next) => {

        let { file } = req.body;

        try {

            if (!file) {
                throw new HttpException(405, req.mf('file type is invalid'));
            }

            const name = { file_name: file };
            res.send(name);
        } catch (error) {
            throw new HttpException(500, error.message);
        }
    };


    // for mobil app
    create = async (req, res, next) => {

        const  service_id = req.params.id;
        let { token} = req.headers;
        let datetime = Math.floor(new Date().getTime())
        // console.log('log');
            
        const client_id = req.currentClient.id;
        // console.log(service_id);
        // console.log(client_id);
        // console.log(token);

        let t = await sequelize.transaction()

        try {

            // console.log('log');
            // const client = await ClientModel.findOne({ 
            //     where: {token: token }});
            //     console.log(client);
            const service = await ServicesModel.findOne({
                where: { id: service_id },
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
    
                    }
                ],
            });

            if (!service) {
                throw new HttpException(500, req.mf('Something went wrong'));
            }
        
            const model = await OrderModel.create({
                datetime: datetime,
                service_id: service_id,
                client_id: client_id,
                status: service.status,
                pay_user_id: 0,
                pay_status: 0,
                user_id: 0,
                agent_id: 0,
                comment_uz: service.comment_uz,
                comment_ru: service.comment_ru,
                comment_ka: service.comment_ka,
                summa: service.summa,
                discount_summa: 0
            }, { transaction: t });
            
            // console.log('log');
            // console.log(model);

            if (!model) {
                throw new HttpException(500, req.mf('Something went wrong'));
            }
            
            for (let i = 0; i < service.services_steps_table.length; i++) {
                // let date = Math.floor(new Date().getTime())
                const element = service.services_steps_table[i];
                
               let model_table = await OrderStepsTableModel.create({
                    parent_id: model.id,
                    title_uz: element.title_uz,
                    title_ru: element.title_ru,
                    title_ka: element.title_ka,
                    status: element.status,
                    comment_uz: element.comment_uz,
                    comment_ru: element.comment_ru,
                    comment_ka: element.comment_ka,
                    action: element.action,
                    action_title_uz: element.action_title_uz,
                    action_title_ru: element.action_title_ru,
                    action_title_ka: element.action_title_ka,
                    active: element.active,
                    promocode: '',
                    active_promocode: element.active_promocode,
                }, { transaction: t });
                for (let j = 0; j < element.steps_fields_table.length; j++) {
                    // console.log('test ');
                    // console.log(model_table.id);
                    // console.log(element.steps_fields_table[j].title);
                    let elementx = element.steps_fields_table[j]
                    // console.log('ichidagini ichidagisi: ' + steps_fields_table);
                    // console.log(elementx.title);
                    
                    await OrderStepsFieldsTableModel.create({
                        steps_parent_id: model_table.id,
                        title_uz: elementx.title_uz,
                        title_ru: elementx.title_ru,
                        title_ka: elementx.title_ka,
                        type: elementx.type,
                        value: ''
                    }, { transaction: t });
                }
            }
            await t.commit();

            let lang = req.get('Accept-Language');
            lang = lang? lang: 'uz';
            
            const modelx = await OrderModel.findOne({
                where: { id: model.id },
                attributes: [
                    'id', 'datetime', 'service_id', 'client_id', 'user_id', 'pay_user_id', 'pay_status', 'status', 'summa', 'discount_summa',
                    [ sequelize.literal(`OrderModel.comment_${lang}`), 'comment' ],
                ],
                include: [
                    {
                        model: ClientModel,
                        as: 'client',
                        required: false
    
                    },
                    {
                        model: ServicesModel,
                        attributes: [
                            'id', 'icon', 'summa',
                            [ sequelize.literal(`services.name_${lang}`), 'name' ],
                            [ sequelize.literal(`average_date_${lang}`), 'average_date' ],
                            [ sequelize.literal(`services.comment_${lang}`), 'comment' ],
                        ],
                        as: 'services',
                        required: false
    
                    },
                    {
                        model: OrderStepsTableModel,
                        attributes: [
                            'id', 'parent_id', 'promocode', 'check_promocode', 'active_promocode', 'status', 'action', 'active',
                            [ sequelize.literal(`action_title_${lang}`), 'action_title' ],
                            [ sequelize.literal(`order_steps_table.title_${lang}`), 'title' ],
                            [ sequelize.literal(`order_steps_table.comment_${lang}`), 'comment' ],
                        ],
                        as: 'order_steps_table',
                        required: false,
                        include: [
                            {
                                model: OrderStepsFieldsTableModel,
                                attributes: [
                                    'id', 'steps_parent_id', 'type', 'value', 'column_status',
                                    [ sequelize.literal(`\`order_steps_table->order_steps_fields_table\`.title_${lang}`), 'title' ]
                                ],
                                as: 'order_steps_fields_table',
                                required: false
        
                            }
                        ],
    
                    }
                ],
            });

            // res.send(service);
            // res.send(model);
            res.send(modelx);
        } catch (error) {
            await t.rollback();
            throw new HttpException(500, error.message);
        }
    };


    // for front app
    created = async (req, res, next) => {

        const  service_id = req.params.id;
        let datetime = Math.floor(new Date().getTime())
            
        const user_id = req.currentUser.id;
        const client_id = req.currentClient.id;
    

        let t = await sequelize.transaction()

        try {

            // console.log('log');
            // const client = await ClientModel.findOne({ 
            //     where: {token: token }});
            //     console.log(client);
            const service = await ServicesModel.findOne({
                where: { id: service_id },
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
    
                    }
                ],
            });

            if (!service) {
                throw new HttpException(500, req.mf('Something went wrong'));
            }
        
            const model = await OrderModel.create({
                datetime: datetime,
                service_id: service_id,
                client_id: client_id,
                user_id: user_id,
                status: service.status,
                pay_user_id: 0,
                pay_status: 0,
                comment_uz: service.comment_uz,
                comment_ru: service.comment_ru,
                comment_ka: service.comment_ka,
                summa: service.summa,
                discount_summa: 0
            }, { transaction: t });
            
            // console.log('log');
            // console.log(model);

            if (!model) {
                throw new HttpException(500, req.mf('Something went wrong'));
            }
            
            for (let i = 0; i < service.services_steps_table.length; i++) {
                // let date = Math.floor(new Date().getTime())
                const element = service.services_steps_table[i];
                
               let model_table = await OrderStepsTableModel.create({
                    parent_id: model.id,
                    title_uz: element.title_uz,
                    title_ru: element.title_ru,
                    title_ka: element.title_ka,
                    status: element.status,
                    comment_uz: element.comment_uz,
                    comment_ru: element.comment_ru,
                    comment_ka: element.comment_ka,
                    action: element.action,
                    action_title_uz: element.action_title_uz,
                    action_title_ru: element.action_title_ru,
                    action_title_ka: element.action_title_ka,
                    active: element.active,
                    promocode: '',
                    active_promocode: element.active_promocode,
                }, { transaction: t });
                for (let j = 0; j < element.steps_fields_table.length; j++) {
                    // console.log('test ');
                    // console.log(model_table.id);
                    // console.log(element.steps_fields_table[j].title);
                    let elementx = element.steps_fields_table[j]
                    // console.log('ichidagini ichidagisi: ' + steps_fields_table);
                    // console.log(elementx.title);
                    
                    await OrderStepsFieldsTableModel.create({
                        steps_parent_id: model_table.id,
                        title_uz: elementx.title_uz,
                        title_ru: elementx.title_ru,
                        title_ka: elementx.title_ka,
                        type: elementx.type,
                        value: ''
                    }, { transaction: t });
                }
            }
            await t.commit();
            const modelx = await OrderModel.findOne({
                where: { id: model.id },
                include: [
                    {
                        model: ClientModel,
                        as: 'client',
                        required: false
    
                    },
                    {
                        model: ServicesModel,
                        as: 'services',
                        required: false
    
                    },
                    {
                        model: OrderStepsTableModel,
                        as: 'order_steps_table',
                        required: false,
                        include: [
                            {
                                model: OrderStepsFieldsTableModel,
                                as: 'order_steps_fields_table',
                                required: false
        
                            }
                        ],
    
                    }
                ],
            });

            // res.send(service);
            // res.send(model);
            res.send(modelx);
        } catch (error) {
            await t.rollback();
            throw new HttpException(500, error.message);
        }
    };


    update = async (req, res, next) => {

        let { order_steps_table } = req.body;
        let { client_id, service_id, status } = req.body;
        let id = req.params.id;
        // console.log(order_steps_table);

        let t = await sequelize.transaction()

        try {

            const client = await ClientModel.findOne({
                where: {
                    id: client_id
                }
            });


            if (!client) {
                throw new HttpException(500, req.mf('data not found'));
            }

            const model = await OrderModel.findOne({
                where: {
                    id: id,
                    client_id: client_id,
                    service_id: service_id
                }
            });

            if (!model) {
                throw new HttpException(500, req.mf('Something went wrong'));
            }

            if (status) {
                model.status = status;
                await model.save();
            }
            // console.log(order_steps_fields_table);

            await this.#deleteRelated(model.id);

            for (let i = 0; i < order_steps_table.length; i++) {
                // let date = Math.floor(new Date().getTime())
                const element = order_steps_table[i];

                let model_table = await OrderStepsTableModel.create({
                    parent_id: model.id,
                    title_uz: element.title_uz,
                    title_ru: element.title_ru,
                    title_ka: element.title_ka,
                    status: element.status,
                    comment_uz: element.comment_uz,
                    comment_ru: element.comment_ru,
                    comment_ka: element.comment_ka,
                    action: element.action,
                    action_title_uz: element.action_title_uz,
                    action_title_ru: element.action_title_ru,
                    action_title_ka: element.action_title_ka,
                    active: element.active
                }, { transaction: t });

                for (let j = 0; j < element.order_steps_fields_table.length; j++) {
                    // console.log('test ');
                    // console.log(element.order_steps_fields_table[j].title);
                    let elementx = element.order_steps_fields_table[j]
                    // console.log('ichidagini ichidagisi: ' + order_steps_fields_table);
                    // console.log(elementx.title);

                    await OrderStepsFieldsTableModel.create({
                        steps_parent_id: model_table.id,
                        title_uz: elementx.title_uz,
                        title_ru: elementx.title_ru,
                        title_ka: elementx.title_ka,
                        type: elementx.type,
                        value: elementx.value,
                        column_status: elementx.column_status
                    }, { transaction: t });
                }
            }
            await t.commit();
            const modelx = await OrderModel.findOne({
                where: { id: model.id },
                include: [
                    {
                        model: OrderStepsTableModel,
                        as: 'order_steps_table',
                        required: false,
                        include: [
                            {
                                model: OrderStepsFieldsTableModel,
                                as: 'order_steps_fields_table',
                                required: false

                            }
                        ],

                    }
                ],
            });

            res.send(modelx);
        } catch (error) {
            await t.rollback();
            throw new HttpException(500, error.message);
        }
    };


    delete = async (req, res, next) => {
        const model = await OrderModel.findOne({ where : { id: req.params.id } })
        
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        try {
            await model.destroy({ force: true });
        } catch (error) {
            await model.destroy();
        }

        //res.send(req.mf('data has been deleted'));
        throw new HttpException(204, 'data has been deleted');
    };


    deleteOrder = async (req, res, next) => {
        const model = await OrderModel.findOne({ where : { id: req.params.id } })
        
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        try {
            await model.destroy({ force: true });
        } catch (error) {
            await model.destroy();
        }

        res.send(req.mf('data has been deleted'));
    };


    // for web app
    payClient = async (req, res, next) => {

        let { order_id, pay_status} = req.body;    
        const pay_user_id = req.currentUser.id;    

        let t = await sequelize.transaction()

        try {

            const order = await OrderModel.findOne({
                where: { id: order_id }
            });
    
            if (!order) {
                throw new HttpException(404, req.mf('data not found'));
            }

            if (pay_status) {
                order.pay_status = pay_status;
                order.pay_user_id = pay_user_id;
                await order.save();   
            }

            await t.commit();
            res.send(order);
        } catch (error) {
            await t.rollback();
            throw new HttpException(500, error.message);
        }
    };
    

    #deleteRelated = async (parent_id) => {
        let stepsModel = OrderStepsTableModel.findAll({ where: { parent_id: parent_id } });

        if(stepsModel){
            await OrderStepsTableModel.destroy({
                where: { parent_id: parent_id },
                force: true
            }, { transaction: t });
            for (let i = 0; i < stepsModel.length; i++) {
                
                await OrderStepsFieldsTableModel.destroy({
                    where: { steps_parent_id: stepsModel.id },
                    force: true
                }, { transaction: t });
                
            }
        }

    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new OrderController;