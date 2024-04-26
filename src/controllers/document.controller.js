const DocumentModel = require('../models/document.model');
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

        let modelList = await DocumentModel.findAll({
            attributes: [
                'id',
                'type',
                'file',
                "url",
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
        let modelList = await DocumentModel.findAll({
            order: [
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };


    getUploadFile = async (req, res, next) => {
        let { file } = req.body;

        try {
            if (!file) {
                throw new HttpException(405, req.mf("file type is invalid"));
            }
            const model = { file: file };
            res.send(model);
        } catch (error) {
            throw new HttpException(500, error.message);
        }
    };


    getById = async (req, res, next) => {
        const model = await DocumentModel.findOne({
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
            file,
            status,
            type,
            url
        } = req.body;

        const model = await DocumentModel.create({
            title_uz,
            title_ru,
            title_ka,
            file,
            status,
            type,
            url
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let { title_uz, title_ru, title_ka, type, file, status, url } = req.body;
        const model = await DocumentModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.title_uz = title_uz;
        model.title_ru = title_ru;
        model.title_ka = title_ka;
        model.file = file;
        model.status = status;
        model.type = type;
        model.url = url;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await DocumentModel.findOne({ where: { id: req.params.id } })

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        try {
            if (model.file) {
                fs.unlinkSync('./uploads/adverstisement/' + model.file);
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
module.exports = new AdvertisementController;