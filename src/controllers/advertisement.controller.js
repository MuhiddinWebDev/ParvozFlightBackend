const AdvertisementModel = require('../models/advertisement.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const fs = require('fs');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class AddressController extends BaseController {

    getAllMobile = async (req, res, next) => {

        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        let modelList = await AdvertisementModel.findAll({
            attributes: [
                'id',
                'image',
                [sequelize.literal(`title_${lang}`), 'title'],
                [sequelize.literal(`text_${lang}`), 'text']
            ],
            where:{
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
        let modelList = await AdvertisementModel.findAll({
            attributes:['id','title_uz','title_ru','title_ka','image','status'],
            order: [
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };


    getUploadFile = async (req, res, next) => {
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


    getById = async (req, res, next) => {
        const model = await AdvertisementModel.findOne({
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
            text_uz,
            text_ru,
            text_ka,
            image,
            status,
        } = req.body;

        const model = await AdvertisementModel.create({
            title_uz,
            title_ru,
            title_ka,
            text_uz,
            text_ru,
            text_ka,
            image,
            status,
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let { title_uz, title_ru, title_ka, text_uz, text_ru, text_ka, image, status } = req.body;
        const model = await AdvertisementModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.title_uz = title_uz;
        model.title_ru = title_ru;
        model.title_ka = title_ka;
        model.text_uz = text_uz;
        model.text_ru = text_ru;
        model.text_ka = text_ka;
        model.image = image;
        model.status = status;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await AdvertisementModel.findOne({ where: { id: req.params.id } })

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        try {
            if (model.image) {
                fs.unlinkSync('./uploads/adverstisement/' + model.image);
            }
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