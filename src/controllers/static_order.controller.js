const StaticOrderModel = require('../models/static_order.model');
const ChatModel = require("../models/chat.model");
const WorkAddressModel = require("../models/work_address.model");
const ClientModel = require("../models/client.model")
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              order Controller
 ******************************************************************************/
class AddressController extends BaseController {

    getAll = async (req, res, next) => {
        let modelList = await StaticOrderModel.findAll({
            include: [
                {
                    model: WorkAddressModel,
                    as: 'region',
                    attributes: ['id', 'name_uz'],
                    required: false
                },
                {
                    model: ClientModel,
                    as: 'client',
                    attributes: ['id', 'fullname', 'phone', 'name'],
                    required: false
                }
            ],
            order: [
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const order = await StaticOrderModel.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: WorkAddressModel,
                    as: 'region',
                    attributes: ['id', 'name_uz'],
                    required: false
                },
                {
                    model: ClientModel,
                    as: 'client',
                    attributes: ['id', 'fullname', 'phone', 'name'],
                    required: false
                }
            ],
        });

        if (!order) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(order);
    };


    getByClient = async (req, res, next) => {
        const currentClient = req.currentClient;
        let lang = req.get("Accept-Language");
        lang = lang ? lang : "uz";
        const order = await StaticOrderModel.findAll({
            where: { client_id: currentClient.id },
            include: [
                {
                    model: WorkAddressModel,
                    as: 'region',
                    attributes: ['id',
                        [sequelize.literal(`name_${lang}`), 'name']
                    ],
                    required: false
                },
                {
                    model: ClientModel,
                    as: 'client',
                    attributes: ['id', 'fullname', 'phone', 'name'],
                    required: false
                }
            ],
        });

        if (!order) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(order);
    };




    update = async (req, res, next) => {

        let form_data = req.body;
        const model = await StaticOrderModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        let t = await sequelize.transaction();

        try {
            model.status = form_data.status;
            model.region_id = form_data.region_id;
            model.passport = form_data.passport;
            model.migrant_carta = form_data.migrant_carta;
            model.phone = form_data.phone;
            model.save();
            await t.commit();
            res.send(model);

        } catch (err) {
            await t.rollback();
            throw new HttpException(500, err.message);
        }
    };


    uploadImage = async (req, res, next) => {
        let { image } = req.body;

        try {
            if (!image) {
                throw new HttpException(405, req.mf("file type is invalid"));
            }
            const model = { image: image };
            res.send(model);
        } catch (error) {
            throw new HttpException(500, error.message);
        }
    };

    delete = async (req, res, next) => {
        const model = await StaticOrderModel.findOne({ where: { id: req.params.id } })

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
module.exports = new AddressController;