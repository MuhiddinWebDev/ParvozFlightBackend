const AboutUsModel = require('../models/aboutUs.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class AboutUsController extends BaseController { 

    getAll = async (req, res, next) => {    
        let modelList = await AboutUsModel.findAll();
        res.send(modelList);
    };

    getForMobile = async (req, res, next) => {    
        let model = await AboutUsModel.findOne({
            order:[['id','DESC']]
        });
        res.send(model);
    };

    getById = async (req, res, next) => {
        const user = await AboutUsModel.findOne({
            where:{ id: req.params.id }
        });

        if (!user) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(user);
    };


    create = async (req, res, next) => {

        let { 
            telegram,
            instagram,
            facebook,
            phone
        } = req.body;

        const model = await AboutUsModel.create({
            telegram,
            instagram,
            facebook,
            phone
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let { telegram, instagram, facebook, phone } = req.body;
        const model = await AboutUsModel.findOne({ where: { id: req.params.id }} );

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        
        model.telegram = telegram;
        model.instagram = instagram;
        model.facebook = facebook;
        model.phone = phone;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await AboutUsModel.findOne({ where : { id: req.params.id } })
        
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
module.exports = new AboutUsController;