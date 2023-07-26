const BookedTicketModel = require('../models/bookedTicket.model');
const ClientModel = require('../models/client.model');
const AddressModel = require('../models/address.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
const { Op } = require('sequelize');
let JSMTRand = require('js_mt_rand');
const fs = require('fs')

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class BookedTicketController extends BaseController {

    getAll = async (req, res, next) => {
        let modelList = await BookedTicketModel.findAll({
            include: [
                {
                    model: ClientModel,
                    as: 'client',
                    required: false
                },
                {
                    model: AddressModel,
                    as: 'from_where',
                    required: false
                },
                {
                    model: AddressModel,
                    as: 'to_where',
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
        const model = await BookedTicketModel.findOne({
            where:{ id: req.params.id },
            include: [
                {
                    model: ClientModel,
                    as: 'client',
                    required: false
                },
                {
                    model: AddressModel,
                    as: 'from_where',
                    required: false
                },
                {
                    model: AddressModel,
                    as: 'to_where',
                    required: false
                }
            ],
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    // for promocode
    create = async (req, res, next) => {
        let {
            from_where_id,
            to_where_id,
            date_flight,
            baggage
        } = req.body;
        
        try {

            const token = req.headers.token;
            const client = await ClientModel.findOne({ where: {token: token }});
            
            let model = await BookedTicketModel.create({
                from_where_id: from_where_id, 
                to_where_id: to_where_id, 
                date_flight: Math.floor(new Date(date_flight).getTime()), 
                baggage: baggage,
                client_id: client.id,
                status: "new"
            });

            res.send(model);
        } catch (error) {
            throw new HttpException(500, error.message)
        }
    };


    update = async (req, res, next) => {

        let {
            from_where_id,
            to_where_id,
            date_flight,
            baggage,
            client_id,
            status
        } = req.body;

        const model = await BookedTicketModel.findOne({ where: { id: req.params.id }} );

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        try {
        
            // model.from_where_id = from_where_id, 
            // model.to_where_id = to_where_id, 
            // model.date_flight = date_flight, 
            // model.baggage = baggage, 
            // model.client_id = client_id, 
            model.status = status, 
            await model.save();

            res.send(model);
        } catch (error) {
            throw new HttpException(500, error.message)
        }
    };


    delete = async (req, res, next) => {
        const model = await BookedTicketModel.findOne({ where : { id: req.params.id } })
        
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
module.exports = new BookedTicketController;