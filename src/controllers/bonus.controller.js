const bonusModel = require('../models/bonus.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
/******************************************************************************
 *                              Bonus Controller
 ******************************************************************************/
class bonusController extends BaseController {

    getAll = async (req, res, next) => {

        let modelList = await bonusModel.findAll({
            order: [
                ['id', 'DESC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {

        const bonus = await bonusModel.findOne();

        if (!bonus) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(bonus);
    };


    create = async (req, res, next) => {

        let {
            summa,

        } = req.body;

        const model = await bonusModel.create({
            summa
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        const model = await bonusModel.findOne({ where: { id: req.params.id } });
        let {
            summa,

        } = req.body;

        model.summa = summa;

        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {

        const model = await bonusModel.findOne({ where: { id: req.params.id } })

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
module.exports = new bonusController;