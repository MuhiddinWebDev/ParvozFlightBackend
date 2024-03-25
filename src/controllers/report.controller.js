const OrderTable = require('../models/order.model');
const ClietModel = require('../models/client.model');
const UserModel = require('../models/user.model');
const RoomTableModel = require('../models/roomTable.model');
const WorkTableModel = require("../models/workTable.model");
const WorkModel = require("../models/work.model")
const RoomModel = require('../models/room.model');
const TicketModel = require('../models/tickets.model');
const AddressBiletModel = require('../models/addressBilet.model')
const TransportModel = require("../models/transport.model")
const BaseController = require('./BaseController');
const sequelize = require("../db/db-sequelize");
const { Op } = require("sequelize");

class ReportController extends BaseController {

    OrderReport = async (req, res, next) => {

        // let {  } = req.body;
        let query = {};
        query.client_id = 11;


        let result = await OrderTable.findAll({
            include: [
                {
                    model: ClietModel,
                    as: 'client',
                    required: false
                }
            ],
            where: query
        });

        res.send(result);
    };


    RoomReport = async (req, res, next) => {
        let { user_id, client_id, sex_id, start_date, end_date } = req.body;
        let query = {};
        let result = {
            total_ad_user: 0,
            total_ad_client: 0,
            total_sex: 0,
            total_price: 0,
            data: [],
        }
        if (user_id) {
            query.user_id = user_id
        }
        if (client_id) {
            query.client_id = client_id;
        }
        if (sex_id) {
            query.sex_id = sex_id;
        }
        query.createdAt = {
            [Op.between]: [new Date(start_date * 1000), new Date(end_date * 1000)]
        }
        result.data = await RoomTableModel.findAll({
            include: [
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['id', 'fullname', 'phone'],
                    required: false
                },
                {
                    model: ClietModel,
                    as: 'client',
                    attributes: ['id', 'fullname', 'phone'],
                    required: false
                },
                {
                    model: RoomModel,
                    as: 'room',
                    attributes: ['id', 'name_uz'],
                    required: false
                }
            ],
            attributes: [
                'id', 'price', 'status', 'createdAt',
                [sequelize.literal("CASE WHEN RoomTableModel.sex_id = 1 THEN 'Umumiy' WHEN RoomTableModel.sex_id = 2 THEN 'Erkak' ELSE 'Ayol' END"), 'sex_name']
            ],
            where: query,
            order: [[client_id ? 'client_id' : 'user_id', "DESC"]],
        });

        result.total_ad_user = await RoomTableModel.findOne({
            attributes: [
                [sequelize.literal('COUNT(user_id)'), 'count']
            ],
            where: query,
        })

        result.total_ad_client = await RoomTableModel.findOne({
            attributes: [
                [sequelize.literal('COUNT(client_id)'), 'count']
            ],
            where: query,
        })

        result.total_sex = await RoomTableModel.findOne({
            attributes: [
                [sequelize.literal('COUNT(sex_id)'), 'count']
            ],
            where: query,
        })

        result.total_price = await RoomTableModel.findOne({
            attributes: [
                [sequelize.literal('SUM(price)'), 'price']
            ],
            where: query,
        })
        res.send(result);

    };

    WorkReport = async (req, res, next) => {
        let { user_id, client_id, sex_id, start_date, end_date } = req.body;
        let query = {};
        let result = {
            total_ad_user: 0,
            total_ad_client: 0,
            total_sex: 0,
            total_price_from: 0,
            total_price_to: 0,
            data: [],
        }
        if (user_id) {
            query.user_id = user_id
        }
        if (client_id) {
            query.client_id = client_id;
        }
        if (sex_id) {
            query.sex_id = sex_id;
        }
        query.createdAt = {
            [Op.between]: [new Date(start_date * 1000), new Date(end_date * 1000)]
        }
        result.data = await WorkTableModel.findAll({
            include: [
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['id', 'fullname', 'phone'],
                    required: false
                },
                {
                    model: ClietModel,
                    as: 'client',
                    attributes: ['id', 'fullname', 'phone'],
                    required: false
                },
                {
                    model: WorkModel,
                    as: 'work',
                    attributes: ['id', 'title_uz'],
                    required: false
                }
            ],
            attributes: [
                'id', 'status', 'createdAt', 'title_uz', 'from_price', 'to_price',
                [sequelize.literal("CASE WHEN WorkTableModel.sex_id = 1 THEN 'Umumiy' WHEN WorkTableModel.sex_id = 2 THEN 'Erkak' ELSE 'Ayol' END"), 'sex_name']
            ],
            where: query,
            order: [[client_id ? 'client_id' : 'user_id', "DESC"]],
        });

        result.total_ad_user = await WorkTableModel.findOne({
            attributes: [
                [sequelize.literal('COUNT(user_id)'), 'count']
            ],
            where: query,
        })

        result.total_ad_client = await WorkTableModel.findOne({
            attributes: [
                [sequelize.literal('COUNT(client_id)'), 'count']
            ],
            where: query,
        })

        result.total_sex = await WorkTableModel.findOne({
            attributes: [
                [sequelize.literal('COUNT(sex_id)'), 'count']
            ],
            where: query,
        })

        result.total_price_from = await WorkTableModel.findOne({
            attributes: [
                [sequelize.literal('SUM(from_price)'), 'summa']
            ],
            where: query,
        })
        result.total_price_to = await WorkTableModel.findOne({
            attributes: [
                [sequelize.literal('SUM(to_price)'), 'summa']
            ],
            where: query,
        })
        res.send(result);

    };

    TicketReport = async (req, res, next) => {
        let { user_id, client_id, start_date, end_date } = req.body;
        let query = {};
        let result = {
            total_uzs: 0,
            total_rus: 0,
            total_usd: 0,
            data: [],
        }
        if (user_id) {
            query.creator_id = user_id
        }
        if (client_id) {
            query.client_id = client_id;
        }

        // query.createdAt = {
        //     [Op.between]: [new Date(start_date * 1000), new Date(end_date * 1000)]
        // }
        result.data = await TicketModel.findAll({
            attributes: [
                'id', 'date', 'end_date', 'status','company',
                [sequelize.literal("CASE WHEN TicketsModel.currency = 'UZS' THEN price ELSE 0 END"), 'price_uzs'],
                [sequelize.literal("CASE WHEN TicketsModel.currency = 'RUB' THEN price ELSE 0 END"), 'price_rus'],
                [sequelize.literal("CASE WHEN TicketsModel.currency = 'USD' THEN price ELSE 0 END"), 'price_usd']
            ],
            include: [
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['id', 'fullname', 'phone'],
                    required: false
                },
                {
                    model: ClietModel,
                    as: 'client',
                    attributes: ['id', 'fullname', 'phone'],
                    required: false
                },
                {
                    model: TransportModel,
                    as: 'transport',
                    attributes: ['id', 'name_uz']
                },
                {
                    model: AddressBiletModel,
                    as: 'from',
                    attributes: ['id', 'name_uz']
                },
                {
                    model: AddressBiletModel,
                    as: 'to',
                    attributes: ['id', 'name_uz']
                }
            ],
            where: query,
            order: [[client_id ? 'client_id' : 'creator_id', "DESC"]],
        });

        result.total_uzs = await TicketModel.findOne({
            attributes: [[sequelize.literal("SUM(CASE WHEN TicketsModel.currency = 'UZS' THEN price ELSE 0 END)"), 'price']],
            where: query
        })
        result.total_rus = await TicketModel.findOne({
            attributes: [[sequelize.literal("SUM(CASE WHEN TicketsModel.currency = 'RUB' THEN price ELSE 0 END)"), 'price']],
            where: query
        })
        result.total_usd = await TicketModel.findOne({
            attributes: [[sequelize.literal("SUM(CASE WHEN TicketsModel.currency = 'USD' THEN price ELSE 0 END)"), 'price']],
            where: query
        })

        res.send(result);
    }
}

module.exports = new ReportController