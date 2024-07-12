const NewsModel = require('../models/news.model');
const ClientModel = require('../models/client.model')

const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const fs = require('fs');
const { body } = require('express-validator');
const moment = require('moment')
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class AdvertisementController extends BaseController {

    getAllMobile = async (req, res, next) => {
        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        let modelList = await NewsModel.findAll({
            attributes: [
                'id', 'network', 'image', 'datetime', 'type', 'video',
                [sequelize.literal(`text_${lang}`), 'text'],
            ],
            where: {
                status: true,
            },
            order: [
                ['id', 'DESC']
            ],
        });
        res.send(modelList);
    };


    getAllWeb = async (req, res, next) => {
        let modelList = await NewsModel.findAll({
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

    sendMobilNotifaction = async (req, res, next) => {
        let model = await NewsModel.findOne({ where: { id: req.params.id } });
        try {
            let message = {
                text: "Barch mijozlarga yuborildi"
            }
            await this.#sendNotifaction(model.dataValues);

            res.send(message)

        } catch (err) {
            console.log(err)
        }
    }

    getById = async (req, res, next) => {
        const model = await NewsModel.findOne({
            where: { id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    create = async (req, res, next) => {

        let {
            text_uz,
            text_ru,
            text_ka,
            image,
            type,
            video,
            status,
            datetime,
            network
        } = req.body;
        const format_date = datetime / 1000;
        const model = await NewsModel.create({
            text_uz,
            text_ru,
            text_ka,
            image,
            type,
            video,
            status,
            datetime: format_date,
            network
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }
        res.send(model);
    };


    update = async (req, res, next) => {

        let { text_uz, text_ru, text_ka, image, network, datetime, status, type, video } = req.body;
        const model = await NewsModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        const format_date = datetime / 1000;
        model.text_uz = text_uz;
        model.text_ru = text_ru;
        model.text_ka = text_ka;
        model.image = image;
        model.video = video;
        model.type = type;
        model.status = status;
        model.datetime = format_date;
        model.network = network;

        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await NewsModel.findOne({ where: { id: req.params.id } })

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        try {
            if (model.file) {
                fs.unlinkSync('./uploads/image/' + model.file);
            }
            await model.destroy({ force: true });
        } catch (error) {
            await model.destroy();
        }

        res.send(req.mf('data has been deleted'));
    };

    #sendNotifaction = async (model) => {
        try {
            let client = await ClientModel.findAll();
            let base_url = "http://192.168.88.114:5010/api/v1/uploads/image/";
            // let base_url = "https://api.dom-m.uz/api/v1/uploads/image/";
            let image = base_url + model.image;
            for (let i = 0; i < client.length; i++) {
                let element = client[i];
                if (element.fcm_token) {
                    let lang = element.lang;
                    let currentTitle = model['text_' + lang];
                    let message = {
                        to: element.fcm_token,
                        notification: {
                            title: currentTitle,
                            body: `${moment(model.datetime * 1000).format('DD.MM.YYYY')}`,
                            type: "news",
                            data: model.id
                        },
                        data: {
                            payload: "news",
                            groupKey: model.id,
                            bigPicture: model.image ? image : null
                        },
                    };
                    await this.notification(message);
                }
            }
        } catch (err) {

        }
    }

}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new AdvertisementController;