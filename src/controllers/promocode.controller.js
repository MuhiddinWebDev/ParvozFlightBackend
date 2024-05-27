const PromocodeModel = require('../models/promocode.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
const { v4: uuidv4 } = require('uuid');
const ClientModel = require('../models/client.model');
/******************************************************************************
 *                              model Controller
 ******************************************************************************/
class promocodeController extends BaseController {

    getAll = async (req, res, next) => {
        let modelList = await PromocodeModel.findAll({
            order: [
                ['id', 'DESC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const model = await PromocodeModel.findOne({
            where: { id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    create = async (req, res, next) => {

        let {
            name,
            promocode,
            phone
        } = req.body;

        const model = await PromocodeModel.create({
            name,
            promocode,
            phone
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let { name, promocode, phone } = req.body;
        const model = await PromocodeModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        
        let isUpdate = await ClientModel.findOne({where: { promocode: promocode}})
        if(isUpdate){
            throw new HttpException(400, "Yangilash mumkin emas. Bu promokod mijozlarga bo'glangan");
        }
        model.name = name;
        model.promocode = promocode;
        model.phone = phone;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await PromocodeModel.findOne({ where: { id: req.params.id } })

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

    autoCode = async (req, res, next) => {
        let { limit } = req.body;
        let newCode =  await this.#isUnique(limit ? limit : 6);
        let data = {
            code: newCode
        };
        res.send(data)
    }


    #isUnique = async (length = 6) => {
        let promoCode;
        let isUnique = false;

        while (!isUnique) {
            // Generate a promo code
            let uuid = uuidv4().replace(/-/g, '');
            promoCode = uuid.substring(0, length).toUpperCase();

            // Check if it already exists in the database
            const existingCode = await PromocodeModel.findOne({
                where: {
                    promocode: promoCode
                }
            });

            if (!existingCode) {
                isUnique = true;
            }
        }

        return promoCode;
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new promocodeController;