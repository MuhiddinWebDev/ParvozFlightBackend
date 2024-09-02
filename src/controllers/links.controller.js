const LinksModel = require('../models/links.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class LinksController extends BaseController {

    getAll = async (req, res, next) => {
        let modelList = await LinksModel.findAll();
        res.send(modelList);
    };

    getById = async (req, res, next) => {
        const user = await LinksModel.findOne({
            where: { id: req.params.id }
        });

        if (!user) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(user);
    };


    create = async (req, res, next) => {

        let {
            android,
            ios,
        } = req.body;

        const model = await LinksModel.create({
            android,
            ios,
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let { android, ios } = req.body;
        const model = await LinksModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.android = android;
        model.ios = ios;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await LinksModel.findOne({ where: { id: req.params.id } })

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
module.exports = new LinksController;