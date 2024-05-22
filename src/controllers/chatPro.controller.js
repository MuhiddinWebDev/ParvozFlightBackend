const ChatProModel = require('../models/chatPro.model');
const StaticOrderModel = require('../models/static_order.model');
const ClientModel = require('../models/client.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
const _ = require('lodash');
const { currentClient } = require('./client.controller');
/******************************************************************************
 *                              Chat Pro Controller
 ******************************************************************************/
class ChatController extends BaseController {
    io;
    socket;
    socketConnect = (io, socket, token) => {
        this.io = io;
        this.socket = socket;
        this.token = token
    };
    getAll = async (req, res, next) => {
        let modelList = await ChatProModel.findAll({
            order: [
                ['datetime', 'DESC']
            ]
        });
        res.send(modelList);
    };


    // Clientlarning orderlar boyicha chati
    getAllByClient = async (req, res, next) => {
        const order_id = req.params.id;

        try {

            let modelList = await ChatProModel.findAll({
                where: { order_id: order_id },
                include: [
                    {
                        model: StaticOrderModel,
                        as: 'static_order',
                        required: false,
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

            let modelList = await ChatProModel.findAll({
                where: { order_id: order_id },
                attributes: ['id', 'order_id', 'user_id', 'datetime', 'text', 'voice', "file", "image"],
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

            let modelList = await ChatProModel.findAll({
                where: { order_id: order_id },
                attributes: ['id', 'order_id', 'user_id', 'datetime', 'text', 'voice', 'is_voice', 'file', 'image'],
                order: [
                    ['id', 'ASC']
                ]
            });
            // await t.commit();
            res.send(modelList);
        } catch (error) {
            console.log(error.message)
           
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
                t.voice,
                t.file,
                t.image
            FROM 
                (SELECT 
                    o.id,
                    SUM(CASE WHEN c.view = 0 THEN 1 ELSE 0 END) as count
                FROM \`static_order\` o
                LEFT JOIN chat_pro c ON c.order_id = o.id
                WHERE o.client_id = :client_id and o.status != 'done'
                GROUP BY o.id) t1
            LEFT JOIN (SELECT * FROM (
                SELECT 
                    c.id,
                    c.datetime,
                    c.text,
                    c.voice,
                    c.order_id,
                    c.file,
                    c.image,
                    @group_rank := IF(@current_group = c.order_id, @group_rank + 1, 1) as group_rank,
                    @current_group := c.order_id as current_group
                FROM chat_pro c,
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
            if (value.chat_id == null) {
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
                t.is_voice,
                t.file,
                t.image
            FROM 
                (SELECT 
                    o.id,
                    SUM(CASE WHEN c.seen = 0 THEN 1 ELSE 0 END) as count
                FROM \`static_order\` o
                LEFT JOIN chat_pro c ON c.order_id = o.id
                GROUP BY o.id) t1
            LEFT JOIN (SELECT * FROM (
                SELECT 
                    c.id,
                    c.datetime,
                    c.text,
                    c.voice,
                    c.order_id,
                    c.is_voice,
                    c.file,
                    c.image,
                    @group_rank := IF(@current_group = c.order_id, @group_rank + 1, 1) as group_rank,
                    @current_group := c.order_id as current_group
                FROM chat_pro c,
                (SELECT @current_group := 0, @group_rank := 0) init
                ORDER BY c.order_id, c.datetime DESC, c.id DESC
            ) temp WHERE group_rank < 2) t ON t1.id = t.order_id`;
        let result = await sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT,
            raw: true
        });

        result = await Promise.all(result.map(async (value) => {
            let order = await StaticOrderModel.findOne({
                include: [
                    {
                        model: ClientModel,
                        as: 'client',
                        attributes: ['id', 'fullname', 'phone'],
                        required: false
                    }
                ],
                where: { id: value.order_id }
            });

            if (value.chat_id == null) {
                value.chat_id = 0;
                value.datetime = '';
                value.text = '';
                value.voice = '';
                value.is_voice = '';
            }
            if (order) {
                value.client = order.dataValues.client;
            }
            else {
                value.client = null
            }
            return value;
        }))

        res.send(result);
    };


    getById = async (req, res, next) => {
        const model = await ChatProModel.findOne({
            where: { id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    // for mobile chat
    create = async (req, res, next) => {
        const client_token = req.currentClient.token
        let {
            order_id,
            text
        } = req.body;

        const chats = await ChatProModel.findAll({
            where: {
                order_id: order_id,
                view: 0,
                seen: 1
            },
            order: [
                ['id', 'DESC']
            ]
        });

        let datetime = Math.floor(new Date().getTime())
        // datetime = datetime * 1000;
        if (chats) {
            for (let i = 0; i < chats.length; i++) {
                const chat = chats[i];
                if (chat.user_id > 0) {
                    const chat_model = await ChatProModel.findOne({
                        where: { id: chat.id }
                    })
                    chat_model.view = true;
                    await chat_model.save();
                }
            }
        }

        const model = await ChatProModel.create({
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
        await this.#sendSocket(model, 'client',client_token)
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
        let datetime = Math.floor(new Date().getTime())
        order_id = parseInt(order_id);
        user_id = parseInt(user_id);


        if (user_id > 0) {
            view = false;
            seen = true;
            const chats = await ChatProModel.findAll({
                where: {
                    order_id: order_id,
                    view: 1,
                    seen: 0
                },
                order: [
                    ['id', 'DESC']
                ]
            });

            if (chats) {
                for (let i = 0; i < chats.length; i++) {
                    const chat = chats[i];
                    const chat_model = await ChatProModel.findOne({
                        where: { id: chat.id }
                    })
                    chat_model.seen = true;

                    await chat_model.save();

                }
            }

            const order = await StaticOrderModel.findOne({
                where: { id: req.body.order_id }
            });

            let client_id = parseInt(order.client_id)
            let client = await ClientModel.findOne({
                where: { id: client_id }
            });

            let fcm_token = client.fcm_token;
            let title = "Sizga yangi ovozli xabar keldi";
            let type = "chat";
            var message = {
                to: fcm_token,
                notification: {
                    title: title,
                    body: file,
                    type: type,
                    data: order.id
                }
            };
            await this.notification(message);
        } else {
            user_id = 0;
            const chats = await ChatProModel.findAll({
                where: {
                    order_id: order_id,
                    view: 0,
                    seen: 1
                },
                order: [
                    ['id', 'DESC']
                ]
            });

            if (chats) {
                for (let i = 0; i < chats.length; i++) {
                    const chat = chats[i];
                    const chat_model = await ChatProModel.findOne({
                        where: { id: chat.id }
                    })
                    chat_model.view = true;

                    await chat_model.save();

                }
            }
        }

        const model = await ChatProModel.create({
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
        const client_token = req.currentClient;
        const user_token = req.currentUser;
        if(client_token){
            await this.#sendSocket(model, 'client', client_token.token)
        }
        if(user_token){
            await this.#sendSocket(model,'user', user_token.token)
        }
        res.status(201).send(model);
    };

    uploadFile = async (req, res, next) => {

        let {
            order_id,
            user_id,
            file
        } = req.body;
        let view = true;
        let seen = false;
        let datetime = Math.floor(new Date().getTime())
        order_id = parseInt(order_id);
        user_id = parseInt(user_id);

        if (user_id > 0) {
            view = false;
            seen = true;
            const chats = await ChatProModel.findAll({
                where: {
                    order_id: order_id,
                    view: 1,
                    seen: 0
                },
                order: [
                    ['id', 'DESC']
                ]
            });

            if (chats) {
                for (let i = 0; i < chats.length; i++) {
                    const chat = chats[i];
                    const chat_model = await ChatProModel.findOne({
                        where: { id: chat.id }
                    })
                    chat_model.seen = true;

                    await chat_model.save();

                }
            }

            const order = await StaticOrderModel.findOne({
                where: { id: req.body.order_id }
            });

            let client_id = parseInt(order.client_id)
            let client = await ClientModel.findOne({
                where: { id: client_id }
            });

            let fcm_token = client.fcm_token;
            let title = "Sizga yangi faylli xabar keldi";
            let type = "chat";
            var message = {
                to: fcm_token,
                notification: {
                    title: title,
                    body: file,
                    type: type,
                    data: order.id
                }
            };
            await this.notification(message);
        } else {
            user_id = 0;

            const chats = await ChatProModel.findAll({
                where: {
                    order_id: order_id,
                    view: 0,
                    seen: 1
                },
                order: [
                    ['id', 'DESC']
                ]
            });

            if (chats) {
                for (let i = 0; i < chats.length; i++) {
                    const chat = chats[i];
                    const chat_model = await ChatProModel.findOne({
                        where: { id: chat.id }
                    })
                    chat_model.view = true;

                    await chat_model.save();

                }
            }
        }

        const model = await ChatProModel.create({
            datetime,
            order_id,
            user_id,
            view,
            seen,
            text: "",
            voice: "",
            image: "",
            file: file,
            is_voice: false
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }
        const client_token = req.currentClient;
        const user_token = req.currentUser;
        if(client_token){
            await this.#sendSocket(model, 'client', client_token.token)
        }
        if(user_token){
            await this.#sendSocket(model,'user', user_token.token)
        }
        res.status(201).send(model);
    };

    uploadImage = async (req, res, next) => {
        let {
            order_id,
            user_id,
            file,
        } = req.body;
        let view = true;
        let seen = false;
        let datetime = Math.floor(new Date().getTime())
        order_id = parseInt(order_id);
        user_id = parseInt(user_id);

        if (user_id > 0) {
            view = false;
            seen = true;
            const chats = await ChatProModel.findAll({
                where: {
                    order_id: order_id,
                    view: 1,
                    seen: 0
                },
                order: [
                    ['id', 'DESC']
                ]
            });

            if (chats) {
                for (let i = 0; i < chats.length; i++) {
                    const chat = chats[i];
                    const chat_model = await ChatProModel.findOne({
                        where: { id: chat.id }
                    })
                    chat_model.seen = true;

                    await chat_model.save();

                }
            }

            const order = await StaticOrderModel.findOne({
                where: { id: req.body.order_id }
            });

            let client_id = parseInt(order.client_id)
            let client = await ClientModel.findOne({
                where: { id: client_id }
            });

            let fcm_token = client.fcm_token;
            let title = "Sizga yangi rasmli xabar keldi";
            let type = "chat";
            var message = {
                to: fcm_token,
                notification: {
                    title: title,
                    body: file,
                    type: type,
                    data: order.id
                }
            };
            await this.notification(message);
        } else {
            user_id = 0;

            const chats = await ChatProModel.findAll({
                where: {
                    order_id: order_id,
                    view: 0,
                    seen: 1
                },
                order: [
                    ['id', 'DESC']
                ]
            });

            if (chats) {
                for (let i = 0; i < chats.length; i++) {
                    const chat = chats[i];
                    const chat_model = await ChatProModel.findOne({
                        where: { id: chat.id }
                    })
                    chat_model.view = true;

                    await chat_model.save();

                }
            }
        }
        const model = await ChatProModel.create({
            datetime,
            order_id,
            user_id,
            view,
            seen,
            text: "",
            voice: "",
            file: "",
            image: file,
            is_voice: false
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }
        const client_token = req.currentClient;
        const user_token = req.currentUser;
        if(client_token){
            await this.#sendSocket(model, 'client', client_token.token)
        }
        if(user_token){
            await this.#sendSocket(model,'user', user_token.token)
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

        const chats = await ChatProModel.findAll({
            where: {
                order_id: order_id,
                view: 1,
                seen: 0
            },
            order: [
                ['id', 'DESC']
            ]
        });

        if (chats) {
            for (let i = 0; i < chats.length; i++) {
                const chat = chats[i];
                const chat_model = await ChatProModel.findOne({
                    where: { id: chat.id }
                })
                chat_model.seen = true;

                await chat_model.save();

            }
        }
        const order = await StaticOrderModel.findOne({
            where: { id: req.body.order_id }
        });


        let client = await ClientModel.findOne({
            where: { id: order.client_id }
        });
        const model = await ChatProModel.create({
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
        const fcm_token = client.fcm_token;
        const title = "Sizga yangi xabar keldi";
        const type = "chat";
        var message = {
            to: fcm_token,
            notification: {
                title: title,
                body: model.text,
                type: type,
                data: model.order_id
            }
        };
        await this.notification(message);
        const user_token = req.currentUser;
        if(user_token){
            await this.#sendSocket(model,'user', user_token.token)
        }

        res.status(201).send(model);
    };

    update = async (req, res, next) => {

        let {
            datetime,
            order_id,
            user_id,
            text
        } = req.body;

        const model = await ChatProModel.findOne({ where: { id: req.params.id } });

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
        const model = await ChatProModel.findOne({ where: { id: req.params.id } })

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

    #sendSocket = async(model, role, token) =>{
        const sockets = await this.io.fetchSockets();
        for (const soc of sockets) {
            if(role == 'client'){
                this.io.to(soc.id).emit("client_text", model, token)
            }
            if(role == 'user'){
                this.io.to(soc.id).emit("user_text", model, token)
            }
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ChatController;