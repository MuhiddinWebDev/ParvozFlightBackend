const OrderTable = require('../models/order.model');
const ClietModel = require('../models/client.model');
const UserModel = require('../models/user.model');
const RoomTableModel = require('../models/roomTable.model');
const RoomImageModel = require("../models/roomImage.model");
const AddressModel = require("../models/address.model");
const WorkTableModel = require("../models/workTable.model");
const WorkModel = require("../models/work.model")
const RoomModel = require('../models/room.model');
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
}

module.exports = new ReportController