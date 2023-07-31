const TicketsModel = require('../models/tickets.model');
const TransportModel = require('../models/transport.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const moment = require('moment');
const fs = require('fs')
const sequelize = require('../db/db-sequelize');
const AddressBiletModel = require('../models/addressBilet.model');
const ClientModel = require('../models/client.model');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class TicketsController extends BaseController { 

    getAll = async (req, res, next) => {    

        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';

        const order = req.get('order')?req.get('order'):"false";        
        let query = {};
        query.client_id = 0;
        if(order == "true"){
            query.client_id =  {
                [Op.gt]: 0
            };
        }

        let modelList = await TicketsModel.findAll({
            where: query,
            attributes: ['id', 'client_id','date', 'end_date', 'comment', 'operator_comment', 'status','price','baggage','company_name','rushnoy', 'image', 'currency', 'phone', 'whatsapp'],
            include: [
                {
                    model: TransportModel,
                    attributes: [
                        [ sequelize.literal(`transport.name_${lang}`), 'name' ]
                    ],
                    as: 'transport',
                    required: false
                },
                {
                    model: AddressBiletModel,
                    attributes: [
                        [ sequelize.literal(`from.name_${lang}`), 'name' ]
                    ],
                    as: 'from',
                    required: false
                },
                {
                    model: AddressBiletModel,
                    attributes: [
                        [ sequelize.literal(`to.name_${lang}`), 'name' ]
                    ],
                    as: 'to',
                    required: false
                },
                {
                    model: ClientModel,
                    attributes: [
                        'phone', 'fullname'
                    ],
                    as: 'client',
                    required: false
                }
            ],
            order: [
                ['id', 'DESC']
            ]
        });

        res.send(modelList);
    };

    
    getAllMobil = async (req, res, next) => {    

        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';
        const transport_id = req.query.transport_id;
        const from_id = req.query.from_id;
        const to_id = req.query.to_id;
        let query = {};
        query.client_id = 0;
        const cur_client_id = req.currentClient.id;
        if(transport_id > 0){
            query.transport_id = transport_id;
        }
        if(from_id > 0){
            query.from_id = from_id;
        }
        if(to_id > 0){
            query.to_id = to_id;
        }
        
        let modelList = await TicketsModel.findAll({
            where: query,
            attributes: ['id', 'date', 'price', 'end_date', 'comment', 'operator_comment', 'status', 'image', 'company_name', 'currency', 'phone', 'whatsapp'],
            include: [
                {
                    model: TransportModel,
                    attributes: [ 'icon',
                        [ sequelize.literal(`transport.name_${lang}`), 'name' ]
                    ],
                    as: 'transport',
                    required: false
                },
                {
                    model: AddressBiletModel,
                    attributes: [
                        [ sequelize.literal(`from.name_${lang}`), 'name' ]
                    ],
                    as: 'from',
                    required: false
                },
                {
                    model: AddressBiletModel,
                    attributes: [
                        [ sequelize.literal(`to.name_${lang}`), 'name' ]
                    ],
                    as: 'to',
                    required: false
                },
                {
                    model: ClientModel,
                    attributes: [
                        'phone', 'fullname'
                    ],
                    as: 'client',
                    required: false
                }
            ],
            order: [
                ['id', 'DESC']
            ]
        });
        
        let clientTickets = await TicketsModel.findAll({
            where: { client_id: cur_client_id },
            attributes: ['id', 'parent_id', 'client_id']
        });
        
        let data = [];
        let query_data = {};
        for (let i = 0; i < modelList.length; i++) {
            let element = modelList[i];
            let order = false;
            for (let j = 0; j < clientTickets.length; j++) {
                const elementx = clientTickets[j];
                if (element.id == elementx.parent_id) {
                    order = true;
                }
            }
            
            query_data.id = element.id;
            query_data.date = element.date;
            query_data.price = element.price;
            query_data.end_date = element.end_date;
            query_data.comment = element.comment;
            query_data.operator_comment = element.operator_comment;
            query_data.status = element.status;
            query_data.image = element.image;
            query_data.company_name = element.company_name;
            query_data.currency = element.currency;    
            query_data.order = order;  
            query_data.transport = { "icon": element.transport.dataValues.icon, "name": element.transport.dataValues.name };
            query_data.from = {"name": element.from.dataValues.name};
            query_data.to = {"name": element.to.dataValues.name};
            // query_data.client = element.client?element.client.dataValues:null;
            await data.push(query_data);
            query_data = {};
            
        }

        res.send(data);
    };


    getAllByClient = async (req, res, next) => {    

        const client_id = req.currentClient.id;
        
        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';
        
        let modelList = await TicketsModel.findAll({
            where: { client_id: client_id },
            attributes: ['id', 'date', 'end_date', 'comment', 'operator_comment', 'status', 'currency', 'phone', 'whatsapp'],
            include: [
                {
                    model: TransportModel,
                    attributes: [
                        [ sequelize.literal(`transport.name_${lang}`), 'name' ]
                    ],
                    as: 'transport',
                    required: false
                },
                {
                    model: AddressBiletModel,
                    attributes: [
                        [ sequelize.literal(`from.name_${lang}`), 'name' ]
                    ],
                    as: 'from',
                    required: false
                },
                {
                    model: AddressBiletModel,
                    attributes: [
                        [ sequelize.literal(`to.name_${lang}`), 'name' ]
                    ],
                    as: 'to',
                    required: false
                }
            ],
            order: [
                ['id', 'DESC']
            ]
        });

        res.send(modelList);
    };


    getAllByAgent = async (req, res, next) => {    

        const creator_id = req.currentAgent.id;
        
        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';
        
        let modelList = await TicketsModel.findAll({
            where: { creator_id: creator_id, is_user: false, client_id: 0 },
            attributes: ['id', 'date', 'end_date', 'comment', 'operator_comment', 'status','price','baggage','company_name','rushnoy', 'image', 'currency', 'phone', 'whatsapp'],
            include: [
                {
                    model: TransportModel,
                    attributes: [
                        [ sequelize.literal(`transport.name_${lang}`), 'name' ]
                    ],
                    as: 'transport',
                    required: false
                },
                {
                    model: AddressBiletModel,
                    attributes: [
                        [ sequelize.literal(`from.name_${lang}`), 'name' ]
                    ],
                    as: 'from',
                    required: false
                },
                {
                    model: AddressBiletModel,
                    attributes: [
                        [ sequelize.literal(`to.name_${lang}`), 'name' ]
                    ],
                    as: 'to',
                    required: false
                }
            ],
            order: [
                ['id', 'DESC']
            ]
        });

        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const tickets = await TicketsModel.findOne({
            where:{ id: req.params.id }
        });

        if (!tickets) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(tickets);
    };


    create = async (req, res, next) => {

        const client_id = req.currentClient.id;

        if (req.query.id < 0) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const tickets = await TicketsModel.findOne({
            where:{ id: req.query.id }
        });

        if (!tickets) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const model = await TicketsModel.create({
            transport_id: tickets.transport_id,
            from_id: tickets.from_id,
            to_id: tickets.to_id,
            date: tickets.date,
            end_date: tickets.end_date,
            comment: tickets.comment,
            price: tickets.price,
            company_name: tickets.company_name,
            image: tickets.image,
            rushnoy: tickets.rushnoy,
            baggage: tickets.baggage,
            creator_id: tickets.creator_id,
            client_id: client_id,
            is_user: tickets.is_user,
            currency: tickets.currency,
            parent_id: req.query.id
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    createAdmin = async (req, res, next) => {

        let { 
            transport_id,
            from_id,
            to_id,
            date,
            end_date,
            comment,
            price,
            company_name,
            image,
            rushnoy,
            baggage,
            client_id,
            currency,
            phone,
            whatsapp
        } = req.body;

        const creator_id = req.currentUser.id;

        const model = await TicketsModel.create({
            transport_id,
            from_id,
            to_id,
            date,
            end_date,
            comment,
            price,
            company_name,
            image,
            rushnoy,
            baggage,
            creator_id,
            client_id: client_id?client_id:0,
            is_user: true,
            currency,
            phone: phone?phone:"",
            whatsapp: whatsapp?whatsapp:""
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    uploadImage = async (req, res, next) => {

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


    createAgent = async (req, res, next) => {

        let { 
            transport_id,
            from_id,
            to_id,
            date,
            end_date,
            comment,
            price,
            company_name,
            image,
            rushnoy,
            baggage,
            currency,
            phone,
            whatsapp
        } = req.body;

        const creator_id = req.currentAgent.id;

        const model = await TicketsModel.create({
            transport_id,
            from_id,
            to_id,
            date,
            end_date,
            comment,
            price,
            company_name,
            image,
            rushnoy,
            baggage,
            creator_id,
            currency,
            phone: phone?phone:"",
            whatsapp: whatsapp?whatsapp:""
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        const model = await TicketsModel.findOne({ where: { id: req.params.id }} );

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        let {
            transport_id,
            from_id,
            to_id,
            date,
            end_date,
            comment,
            price,
            company_name,
            image,
            rushnoy,
            baggage,
            operator_comment,
            status,
            currency
        } = req.body;
        

        model.transport_id = transport_id;
        model.from_id = from_id;
        model.to_id = to_id;
        model.date = date ? date: "";
        model.phonw = phonw ? phonw: "";
        model.whatsapp = whatsapp ? whatsapp: "";
        model.end_date = end_date ? end_date : "";
        model.comment = comment ? comment : "";
        model.operator_comment = operator_comment ? operator_comment : "";
        model.status = status;
        model.image = image;
        model.baggage = baggage;
        model.price = price;
        model.company_name = company_name;
        model.rushnoy = rushnoy;
        model.currency = currency;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await TicketsModel.findOne({ where : { id: req.params.id } })
        
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
module.exports = new TicketsController;