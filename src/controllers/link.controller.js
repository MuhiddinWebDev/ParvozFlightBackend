const LinkModel = require('../models/link.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const fs = require('fs');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class LinkController extends BaseController {

    getAllMobile = async (req, res, next) => {

        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        let modelList = await LinkModel.findAll({
            attributes: [
                'id',
                'image',
                'url',
                [sequelize.literal(`title_${lang}`), 'title'],
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
        let modelList = await LinkModel.findAll({
            attributes: ['id', 'title_uz', 'title_ru', 'title_ka', 'image', 'status','url'],
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
        const model = await LinkModel.findOne({
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
            url,
            image,
            status,
        } = req.body;

        const model = await LinkModel.create({
            title_uz,
            title_ru,
            title_ka,
            url,

            image,
            status,
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let { title_uz, title_ru, title_ka, url, image, status } = req.body;
        const model = await LinkModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.title_uz = title_uz;
        model.title_ru = title_ru;
        model.title_ka = title_ka;
        model.url = url;
        model.image = image;
        model.status = status;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await LinkModel.findOne({ where: { id: req.params.id } })

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
module.exports = new LinkController;