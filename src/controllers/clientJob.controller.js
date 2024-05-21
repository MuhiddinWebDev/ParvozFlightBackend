const ClientJobModel = require('../models/clientJob.model');
const ClientJobChildModel = require("../models/clientJobChild.model");
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              model Controller
 ******************************************************************************/
class ClientJobController extends BaseController {

    getAll = async (req, res, next) => {
        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';
        let modelList = await ClientJobModel.findAll({
            attributes: [
                'id',
                [sequelize.literal(`name_${lang}`), 'title']
            ],
            order: [
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };

    getAllChild = async (req, res, next) => {

        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        let modelList = await ClientJobChildModel.findAll({
            attributes: [
                'id',
                [sequelize.literal(`name_${lang}`), 'title'],
                'parent_id'
            ],
            order: [
                ['id', 'ASC']
            ]
        });
        for (let i = 0; i < modelList.length; i++) {
            let el = modelList[i];
            let modelx = await ClientJobModel.findOne({
                where: { id: el.parent_id },
                attributes: [
                    'id',
                    [sequelize.literal(`name_${lang}`), 'title'],
                ],
            })
            modelList[i].dataValues.job = {
                id: modelx.dataValues.id,
                title: modelx.dataValues.title
            }
        }
        res.send(modelList);
    };

    getById = async (req, res, next) => {
        const model = await ClientJobModel.findOne({
            where: { id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };

    getByIdJobAll = async (req, res, next) => {
        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        let model = await ClientJobChildModel.findAll({
            attributes: [
                'id',
                [sequelize.literal(`name_${lang}`), 'title']
            ],
            order: [
                ['id', 'ASC']
            ],
            where: { parent_id: req.query.parent_id }
        });

        res.send(model);
    };

    getByIdChild = async (req, res, next) => {
        const model = await ClientJobChildModel.findOne({
            where: { id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    create = async (req, res, next) => {

        let {
            name_uz,
            name_ru,
            name_ka
        } = req.body;

        const model = await ClientJobModel.create({
            name_uz,
            name_ru,
            name_ka
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };

    createChild = async (req, res, next) => {

        let {
            name_uz,
            name_ru,
            name_ka,
            parent_id,
        } = req.body;

        const model = await ClientJobChildModel.create({
            name_uz,
            name_ru,
            name_ka,
            parent_id,

        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };




    update = async (req, res, next) => {

        let { name_uz, name_ru, name_ka } = req.body;
        const model = await ClientJobModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.name_uz = name_uz;
        model.name_ru = name_ru;
        model.name_ka = name_ka;
        model.save();

        res.send(model);
    };

    updateChild = async (req, res, next) => {

        let { name_uz, name_ru, name_ka, parent_id } = req.body;
        const model = await ClientJobChildModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.name_uz = name_uz;
        model.name_ru = name_ru;
        model.name_ka = name_ka;
        model.parent_id = parent_id;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await ClientJobModel.findOne({ where: { id: req.params.id } })

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

    deleteChild = async (req, res, next) => {
        const model = await ClientJobChildModel.findOne({ where: { id: req.params.id } })

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
module.exports = new ClientJobController;