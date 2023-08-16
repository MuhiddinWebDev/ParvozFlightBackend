const ChatModel = require('../models/chat.model');
const OrderModel = require('../models/order.model');
const ServicesModel = require('../models/services.model');
const ClientModel = require('../models/client.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
const { Op } = require('sequelize');
const _ = require('lodash');
const { isSet } = require('lodash');


/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class ChatController extends BaseController {

    getAll = async (req, res, next) => {
        let modelList = await ChatModel.findAll({
            order: [
                ['datetime', 'DESC']
            ]
        });
        res.send(modelList);
    };


    // Clientlarning orderlar boyicha chati
    getAllByClient = async (req, res, next) => {

        // const client_id = req.currentClient.id;
        const order_id = req.params.id;

        // let t = await sequelize.transaction()

        try {

            let modelList = await ChatModel.findAll({
                where: { order_id:  order_id},
                include: [
                    {
                        model: OrderModel,
                        as: 'order',
                        required: false,
                        include: [
                            {
                                model: ServicesModel,
                                as: 'services',
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
            throw new HttpException(500, req.mf('Something went wrong'));
        }
    };


    // Mobil uchun Clientlarning orderlar boyicha chati
    getAllChatByOrder = async (req, res, next) => {

        const order_id = req.params.id;

        // let t = await sequelize.transaction()

        try {

            let modelList = await ChatModel.findAll({
                where: { order_id:  order_id},
                attributes: [ 'id','order_id','user_id','datetime', 'text', 'voice'],
                order: [
                    ['id', 'ASC']
                ]
            });
            // await t.commit();
            res.send(modelList);
        } catch (error) {
            // await t.rollback();
            throw new HttpException(500, req.mf('Something went wrong'));
        }
    };


    // Mobil uchun Clientlarning orderlar boyicha chati
    getAllChatByOrderWeb = async (req, res, next) => {

        const order_id = req.params.id;

        // let t = await sequelize.transaction()

        try {

            let modelList = await ChatModel.findAll({
                where: { order_id:  order_id},
                attributes: [ 'id','order_id','user_id','datetime', 'text', 'voice', 'is_voice'],
                order: [
                    ['id', 'ASC']
                ]
            });
            // await t.commit();
            res.send(modelList);
        } catch (error) {
            // await t.rollback();
            throw new HttpException(500, req.mf('Something went wrong'));
        }
    };


    // for mobil last message, new message count by order client
    getOrderByChatList = async (req, res, next) => {
        const client_id = req.currentClient.id;

        let sql = `
            SELECT 
                t1.id as order_id,
                t1.count,
                t.id as chat_id,
                t.datetime,
                t.text,
                t.voice
            FROM 
                (SELECT 
                    o.id,
                    SUM(CASE WHEN c.view = 0 THEN 1 ELSE 0 END) as count
                FROM \`order\` o
                LEFT JOIN chat c ON c.order_id = o.id
                WHERE o.client_id = :client_id and o.status != 'done'
                GROUP BY o.id) t1
            LEFT JOIN (SELECT * FROM (
                SELECT 
                    c.id,
                    c.datetime,
                    c.text,
                    c.voice,
                    c.order_id,
                    @group_rank := IF(@current_group = c.order_id, @group_rank + 1, 1) as group_rank,
                    @current_group := c.order_id as current_group
                FROM chat c,
                (SELECT @current_group := 0, @group_rank := 0) init
                ORDER BY c.order_id, c.datetime DESC, c.id DESC
            ) temp WHERE group_rank < 2) t ON t1.id = t.order_id`;
        let result = await sequelize.query(sql, {
            replacements: {
                client_id,
            },
            type: sequelize.QueryTypes.SELECT,
            raw: true
        });

        result = _.map(result, (value) => {
            if(value.chat_id == null){
                value.chat_id = 0;
                value.datetime = '';
                value.text = '';
                value.voice = '';
            }
            return value;
        })

        res.send(result);
    };


    // for web last message, new message count by order
    getOrderByChatListWeb = async (req, res, next) => {

        let sql = `
            SELECT 
                t1.id as order_id,
                t1.count,
                t.id as chat_id,
                t.datetime,
                t.text,
                t.voice,
                t.is_voice
            FROM 
                (SELECT 
                    o.id,
                    SUM(CASE WHEN c.seen = 0 THEN 1 ELSE 0 END) as count
                FROM \`order\` o
                LEFT JOIN chat c ON c.order_id = o.id
                GROUP BY o.id) t1
            LEFT JOIN (SELECT * FROM (
                SELECT 
                    c.id,
                    c.datetime,
                    c.text,
                    c.voice,
                    c.order_id,
                    c.is_voice,
                    @group_rank := IF(@current_group = c.order_id, @group_rank + 1, 1) as group_rank,
                    @current_group := c.order_id as current_group
                FROM chat c,
                (SELECT @current_group := 0, @group_rank := 0) init
                ORDER BY c.order_id, c.datetime DESC, c.id DESC
            ) temp WHERE group_rank < 2) t ON t1.id = t.order_id`;
        let result = await sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT,
            raw: true
        });

        result = _.map(result, (value) => {
            if(value.chat_id == null){
                value.chat_id = 0;
                value.datetime = '';
                value.text = '';
                value.voice = '';
                value.is_voice = '';
            }
            return value;
        })

        res.send(result);
    };


    getById = async (req, res, next) => {
        const model = await ChatModel.findOne({
            where:{ id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    // for mobile chat
    create = async (req, res, next) => {

        let {
            order_id,
            text
        } = req.body;
        
        const chats = await ChatModel.findAll({
            where: {
                order_id: order_id,
                 view: 0,
                 seen: 1
            },
            order: [
                ['id', 'DESC']
            ]
        });
        // console.log('chats ', chats);
        // console.log('order_id ', order_id);
        
        let datetime = Math.floor(new Date().getTime())
        // datetime = datetime * 1000;
        if(chats){
            for (let i = 0; i < chats.length; i++) {
                const chat = chats[i];
                if(chat.user_id > 0){
                    const chat_model = await ChatModel.findOne({
                        where: { id: chat.id }
                    })
                    chat_model.view = true;
                    await chat_model.save();
                    // console.log('chat ', chat.id);
                }
            }
        }

        const model = await ChatModel.create({
            datetime, 
            order_id,
            view: true,
            seen: false,
            user_id: 0,
            text
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    // for mobile chat
    voice = async (req, res, next) => {

        let {
            order_id,
            user_id,
            file
        } = req.body;
        let view = true;
        let seen = false;
        // console.log('user id ' + user_id);
        let datetime = Math.floor(new Date().getTime())
        order_id = parseInt(order_id);
        user_id = parseInt(user_id);
        // console.log('file ', file);
        

        // console.log('client fcm token ' + client.fcm_token);
        if( user_id > 0){
            view = false;
            seen = true;
            const chats = await ChatModel.findAll({
                where: {
                    order_id: order_id,
                    view: 1,
                    seen: 0
                },
                order: [
                    ['id', 'DESC']
                ]
            });
    
            if(chats){
                for (let i = 0; i < chats.length; i++) {
                    const chat = chats[i];
                    const chat_model = await ChatModel.findOne({
                        where: { id: chat.id }
                    })
                    chat_model.seen = true;
                    
                    await chat_model.save();
    
                }
            }
    
            const order = await OrderModel.findOne({
                where: { id: req.body.order_id }
            });

            let client_id = parseInt(order.client_id)
            let client = await ClientModel.findOne({
                where: { id: client_id }
            });
    
            let fcm_token = client.fcm_token;
            let title = "Sizga yangi ovozli xaxab keldi";
            let type = "chat";
            var message = {
                to: fcm_token,
                notification:{
                  title: title,
                  body: file,
                  type: type,
                  data: order.id
                }
              };
            await this.notification(message);
        }else {
            user_id = 0;
    
            const chats = await ChatModel.findAll({
                where: {
                    order_id: order_id,
                    view: 0,
                    seen: 1
                },
                order: [
                    ['id', 'DESC']
                ]
            });
            // console.log('chat ', chats);

            if(chats){
                for (let i = 0; i < chats.length; i++) {
                    const chat = chats[i];
                    const chat_model = await ChatModel.findOne({
                        where: { id: chat.id }
                    })
                    chat_model.view = true;
                    
                    await chat_model.save();
                    
                }
            }
        }

        const model = await ChatModel.create({
            datetime, 
            order_id,
            user_id,
            view,
            seen,
            text: "",
            voice: file,
            is_voice: true
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    // for web chat
    created = async (req, res, next) => {

        let {
            order_id,
            user_id,
            text
        } = req.body;

        let datetime = Math.floor(new Date().getTime())
        // datetime = datetime * 1000;
        
            const chats = await ChatModel.findAll({
                where: {
                    order_id: order_id,
                    view: 1,
                    seen: 0
                },
                order: [
                    ['id', 'DESC']
                ]
            });
    
            if(chats){
                for (let i = 0; i < chats.length; i++) {
                    const chat = chats[i];
                    const chat_model = await ChatModel.findOne({
                        where: { id: chat.id }
                    })
                    chat_model.seen = true;
                    
                    await chat_model.save();
    
                }
            }
            const order = await OrderModel.findOne({
                where: { id: req.body.order_id }
            });
    
            // console.log('order client id', order.client_id);
            
            let client = await ClientModel.findOne({
                where: { id:order.client_id }
            });
            const model = await ChatModel.create({
                datetime, 
                order_id,
                user_id,
                seen: true,
                view: false,
                text
            });
    
            if (!model) {
                throw new HttpException(500, req.mf('Something went wrong'));
            }
            // console.log('token ', client.fcm_token);
            const fcm_token = client.fcm_token;
            const title = "Sizga yangi xabar keldi";
            const type = "chat";
            var message = {
                to: fcm_token,
                notification:{
                  title: title,
                  body: model.text,
                  type: type,
                  data: model.order_id
                }
              };
            await this.notification(message);
            // await this.notification(model, client.fcm_token, title, type);
    
        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let {
            datetime, 
            order_id,
            user_id,
            text
        } = req.body;

        const model = await ChatModel.findOne({ where: { id: req.params.id }} );

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        
        model.datetime = datetime;
        model.order_id = order_id;
        model.user_id = user_id;
        model.text = text;
        model.save();

        res.send(model);
    };

    
    delete = async (req, res, next) => {
        const model = await ChatModel.findOne({ where : { id: req.params.id } })
        
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

    
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ChatController;