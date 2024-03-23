const OrderTable = require('../models/order.model');
const ClietModel = require('../models/client.model');
const UserModel = require('../models/user.model');
const RoomTableModel = require('../models/roomTable.model');
const RoomImageModel = require("../models/roomImage.model");
const AddressModel = require("../models/address.model");
const RoomModel = require('../models/room.model');
const BaseController = require('./BaseController');
const sequelize = require("../db/db-sequelize");
const { Op } = require("sequelize");

class ReportController extends BaseController {

    OrderReport = async (req, res, next) => {

        // let {  } = req.body;
        let query = {};
        query.client_id = 11;
        console.log("query____________")
        console.log(query)

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


    OrderSverka = async (req, res, next) => {
        this.checkValidation(req);

        let { start_date, end_date, Order_id, filial_id, type } = req.body;

        let query = {}, query_begin = {}, query_end = {};
        query.datetime = {
            [Op.gte]: start_date,
            [Op.lte]: end_date,
        };

        if (Order_id) {
            query.Order_id = Order_id;
            query_begin.Order_id = Order_id;
            query_end.Order_id = Order_id;
        }

        if (type != null) {
            query.type = type;
            query_begin.type = type;
            query_end.type = type;
        }

        query_begin.datetime = {
            [Op.lt]: start_date,
        };
        query_end.datetime = {
            [Op.lte]: end_date,
        };

        let result = {
            total_begin: 0,
            total_kirim: 0,
            data: [],
            total_chiqim: 0,
            total_end: 0,
        }
        result.data = await OrderTable.findAll({
            attributes: [
                'datetime', 'doc_id', 'doc_type', 'comment',
                [sequelize.literal('CASE WHEN type = 1 AND datetime >= ' + start_date + ' AND datetime <= ' + end_date + '  THEN summa ELSE 0 END'), 'kirim'],
                [sequelize.literal('CASE WHEN type = 0 AND datetime >= ' + start_date + ' AND datetime <= ' + end_date + '  THEN summa ELSE 0 END'), 'chiqim'],
            ],
            include: [
                {
                    model: OrderModel,
                    as: "Order",
                    attributes: ['id', "name"],
                },
                {
                    model: PayTpeModel,
                    as: "pay_type",
                    attributes: ['id', "name"],
                }
            ],
            where: query,
            order: [["datetime", "ASC"]],
        })

        //begin total
        let Order_register = await OrderTable.findOne({
            attributes: [
                "id", 'datetime',
                [sequelize.literal("sum((summa) * power(-1, type + 1))",), "total",],
            ],
            where: query_begin,
        });
        result.begin_total = Order_register.dataValues.total ? Order_register.dataValues.total : 0;

        //end total
        Order_register = await OrderTable.findOne({
            attributes: [
                "id", 'datetime',
                [sequelize.literal("sum((summa) * power(-1, type + 1))",), "total",]
            ],
            where: query_end,
        });
        result.end_total = Order_register.dataValues.total ? Order_register.dataValues.total : 0;

        for (let i = 0; i < result.data.length; i++) {
            let element = result.data[i].toJSON();

            result.total_kirim += element.kirim ? element.kirim : 0;
            result.total_chiqim += element.chiqim ? element.chiqim : 0;
        }

        res.send(result);
    };

    RoomReport = async (req, res, next) => {

        // let result = await RoomTableModel.findAll({
        //     // include:[
        //     //     {
        //     //         model: UserModel,
        //     //         as:'user',
        //     //         attributes:['id','fullname'],
        //     //         required: false
        //     //     },
        //     //     {
        //     //         model: ClietModel,
        //     //         as:'client',
        //     //         attributes:['id','fullname'],
        //     //         required: false
        //     //     },
        //     //     {
        //     //         model: RoomModel,
        //     //         as: 'room',
        //     //         attributes:['id','name_uz'],
        //     //         required: false
        //     //     }
        //     // ]
        //     attributes: [
        //         "id",
        //         "parent_id",
        //         "price",
        //         "phone_number",
        //         "area",
        //         "status",
        //         "lat",
        //         "long",
        //         "sex_id",
        //     ],
        //     include: [

        //         {
        //             model: RoomModel,
        //             as: 'room',
        //             attributes: ['id', 'name_uz'],
        //             required: false
        //         }
        //     ],
        //     order: [["id", "DESC"]],
        // });

        // res.send(result);
        let lang = req.get("Accept-Language");
        lang = lang ? lang : "uz";
        let body = req.body;
        let client = req.currentClient;

        let query = {};
        query.status = "empty";

        if (body.address_id) {
            query.address_id = body.address_id;
        }

        if (body.parent_id) {
            query.parent_id = body.parent_id;
        }
        if (client) {
            query.sex_id = { [Op.in]: [1, client.sex_id] };
        }


        const modelList = await RoomTableModel.findAll({
            where: query,
            attributes: [
                "id",
                "parent_id",
                "price",
                "phone_number",
                "area",
                "status",
                "lat",
                "long",
                "sex_id",
                [sequelize.literal(`comment_${lang}`), "comment"],
            ],
            include: [
                {
                    model: AddressModel,
                    attributes: ["id", [sequelize.literal(`address.name_${lang}`), "name"]],
                    as: "address",
                    required: false,
                },
                {
                    model: RoomImageModel,
                    as: "images",
                    attributes: ["id", "image", "parent_id"],
                    required: false,
                },
                {
                    model: RoomModel,
                    attributes: [
                        "id",
                        [sequelize.literal(`room.name_${lang}`), "name"]
                    ],
                    as: 'room',
                    required: false
                }
            ],
            order: [["id", "DESC"]],
        });
        
        if (!modelList) {
            throw new HttpException(404, req.mf("data not found"));
        }



        res.send(modelList);
    };

}

module.exports = new ReportController