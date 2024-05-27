const OrderTable = require('../models/order.model');
const ClietModel = require('../models/client.model');
const PromocodeModel = require('../models/promocode.model')
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
        let currentUser = req.currentUser;
        let { user_id, client_id, sex_id, range, parent_id } = req.body;
        let query = {};
        let result = {
            total_ad_user: 0,
            total_ad_client: 0,
            total_sex_all: 0,
            total_sex_male: 0,
            total_sex_female: 0,
            total_price: 0,
            total_busy: 0,
            total_empty: 0,
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
        if (currentUser.role == 'User') {
            query.user_id = currentUser.id;
        }
        if (parent_id) {
            query.parent_id = parent_id;
        }
        if (sex_id) {
            query.sex_id = sex_id;
        }
        query.createdAt = {
            [Op.between]: [new Date(range[0]), new Date(range[1])]
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

        result.total_sex_all = await RoomTableModel.findOne({
            attributes: [
                [sequelize.literal('SUM(CASE WHEN sex_id = 1 THEN 1 ELSE 0 END)'), 'count']
            ],
            where: query,
        });
        result.total_sex_male = await RoomTableModel.findOne({
            attributes: [
                [sequelize.literal('SUM(CASE WHEN sex_id = 2 THEN 1 ELSE 0 END)'), 'count']
            ],
            where: query,
        });
        result.total_sex_female = await RoomTableModel.findOne({
            attributes: [
                [sequelize.literal('SUM(CASE WHEN sex_id = 3 THEN 1 ELSE 0 END)'), 'count']
            ],
            where: query,
        })


        result.total_price = await RoomTableModel.findOne({
            attributes: [
                [sequelize.literal('SUM(price)'), 'price']
            ],
            where: query,
        });

        result.total_busy = await RoomTableModel.findOne({
            attributes: [
                [sequelize.literal('SUM(CASE WHEN status = "busy" THEN 1 ELSE 0 END)'), 'count']
            ],
            where: query,
        });
        result.total_empty = await RoomTableModel.findOne({
            attributes: [
                [sequelize.literal('SUM(CASE WHEN status = "empty" THEN 1 ELSE 0 END)'), 'count']
            ],
            where: query,
        });
        res.send(result);

    };

    WorkReport = async (req, res, next) => {
        let { user_id, client_id, sex_id, range, parent_id } = req.body;
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
        if (parent_id) {
            query.parent_id = parent_id
        }
        query.createdAt = {
            [Op.between]: [new Date(range[0]), new Date(range[1])]
        }
        console.log(query.createdAt)
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

        let { user_id, client_id, range, address_id } = req.body;
        let query = {};
        let result = {
            total_uzs: 0,
            total_rus: 0,
            total_usd: 0,
            data: [],
            total_waiting: 0,
            total_done: 0,
            total_rejected: 0,
        }
        if (user_id) {
            query.creator_id = user_id
        }
        if (client_id) {
            query.client_id = client_id;
        }
        if (address_id) {
            query.from_id = { [Op.or]: [address_id] }
            query.to_id = { [Op.or]: [address_id] }
        }
        // let formattedDateTime = (date) => {
        //     let newDate = new Date(date);
        //    return newDate
        // }
        // query.date = {
        //     [Op.gte]: formattedDateTime(range[0])
        // };
        // query.end_date = {
        //     [Op.lte]: formattedDateTime(range[1])
        // };
        query.createdAt = {
            [Op.between]: [new Date(range[0]), new Date(range[1])]
        }
        result.data = await TicketModel.findAll({
            attributes: [
                'id', 'date', 'end_date', 'status', 'company_name', 'deletedAt',
                [sequelize.literal("CASE WHEN TicketsModel.currency = 'UZS' THEN price ELSE 0 END"), 'price_uzs'],
                [sequelize.literal("CASE WHEN TicketsModel.currency = 'RUB' THEN price ELSE 0 END"), 'price_rus'],
                [sequelize.literal("CASE WHEN TicketsModel.currency = 'USD' THEN price ELSE 0 END"), 'price_usd'],
                [sequelize.literal("CASE WHEN TicketsModel.status = 'waiting' THEN 'Kutilmoqda' ELSE '' END"), 'status_waiting'],
                [sequelize.literal("CASE WHEN TicketsModel.status = 'done' THEN 'Bajarildi' ELSE '' END"), 'status_done'],
                [sequelize.literal("CASE WHEN TicketsModel.status = 'rejected' THEN 'Bekor qilindi' ELSE '' END"), 'status_rejected'],
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
            order: [['deletedAt', "ASC"]],
            paranoid: false,
        });


        result.total_uzs = await TicketModel.findOne({
            attributes: [[sequelize.literal("SUM(CASE WHEN TicketsModel.currency = 'UZS' THEN price ELSE 0 END)"), 'price']],
            where: query,
            paranoid: false,

        })
        result.total_rus = await TicketModel.findOne({
            attributes: [[sequelize.literal("SUM(CASE WHEN TicketsModel.currency = 'RUB' THEN price ELSE 0 END)"), 'price']],
            where: query,
            paranoid: false,

        })
        result.total_usd = await TicketModel.findOne({
            attributes: [[sequelize.literal("SUM(CASE WHEN TicketsModel.currency = 'USD' THEN price ELSE 0 END)"), 'price']],
            where: query,
            paranoid: false,

        })

        result.total_waiting = await TicketModel.findOne({
            attributes: [[sequelize.literal("SUM(CASE WHEN TicketsModel.status = 'waiting' THEN 1 ELSE 0 END)"), 'count']],
            where: query,
            paranoid: false,
        })
        result.total_done = await TicketModel.findOne({
            attributes: [[sequelize.literal("SUM(CASE WHEN TicketsModel.status = 'done' THEN 1 ELSE 0 END)"), 'count']],
            where: query,
            paranoid: false,
        })
        result.total_rejected = await TicketModel.findOne({
            attributes: [[sequelize.literal("SUM(CASE WHEN TicketsModel.status = 'rejected' THEN 1 ELSE 0 END)"), 'count']],
            where: query,
            paranoid: false,
        })
        res.send(result);
    }

    PromocodeReport = async (req, res, next) => {
        let { promocode, range } = req.body;
        let query = {}
        if (promocode) {
            query.promocode = promocode;
        }
        query.createdAt = {
            [Op.between]: [new Date(range[0]), new Date(range[1])]
        }
        let result = {
            data: [],
            total_count: 0,
        }
        result.data = await ClietModel.findAll({
            attributes: [
                'promocode','createdAt',
                [sequelize.literal('COUNT(promocode)'), 'promocode_count']
            ],
            having: sequelize.literal('promocode_count > 0'),
            group: ['promocode'],
            where: query
        })
        for (let i = 0; i < result.data.length; i++) {
            const element = result.data[i];
            if (element.promocode) {
                let model = await PromocodeModel.findOne({ where: { promocode: element.promocode } });
                if(model){
                    element.dataValues.promocode_by = {
                        name: model.dataValues.name,
                        phone: model.dataValues.phone,
                    }
                }
            }
            result.total_count += element.dataValues.promocode_count || 0
        }
        res.send(result)
    }
}

module.exports = new ReportController