const ClientServiceModel = require('../models/clientService.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const fs = require('fs');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class AdvertisementController extends BaseController {

    getAllMobile = async (req, res, next) => {
        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        let modelList = await ClientServiceModel.findAll({
            attributes: [
                "summa", "required","id",
                [sequelize.literal(`title_${lang}`), 'title'],
            ],
            where: {
                status: true,
            },
            order: [
                ['id', 'DESC']
            ],
            limit: 4,
        });
        res.send(modelList);
    };


    getAllWeb = async (req, res, next) => {
        let modelList = await ClientServiceModel.findAll({
            order: [
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const model = await ClientServiceModel.findOne({
            where: { id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    create = async (req, res, next) => {

        let {
            title_uz,
            title_ru,
            title_ka,
            summa,
            required,
            status
        } = req.body;

        const model = await ClientServiceModel.create({
            title_uz,
            title_ru,
            title_ka,
            summa,
            required,
            status
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let { title_uz, title_ru, title_ka, summa, required, status } = req.body;
        const model = await ClientServiceModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.title_uz = title_uz;
        model.title_ru = title_ru;
        model.title_ka = title_ka;
        model.summa = summa;
        model.required = required;
        model.status = status;
        
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await ClientServiceModel.findOne({ where: { id: req.params.id } })

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
module.exports = new AdvertisementController;