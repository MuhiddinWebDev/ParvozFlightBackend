const TransportModel = require('../models/transport.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const moment = require('moment');
const fs = require('fs')
const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class TransportController extends BaseController { 

    getAll = async (req, res, next) => {    

        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';

        let modelList = await TransportModel.findAll({ 
            attributes: [
                'id', 'icon', 'link',
                [ sequelize.literal(`name_${lang}`), 'name' ]
            ],
            order: [    
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const user = await TransportModel.findOne({
            where:{ id: req.params.id }
        });

        if (!user) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(user);
    };


    getUploadImage = async (req, res, next) => {

        let { icon } = req.body;

        try {

            if (!icon) {
                throw new HttpException(500, 'icon type is invalid');
            }
            const name = {
                name: icon
            };

            res.send(name);
        } catch (error) {
            throw new HttpException(500, error.message);
        }
    };


    create = async (req, res, next) => {

        let { name_uz, name_ru, name_ka, icon, link } = req.body;

        const model = await TransportModel.create({
            name_uz,
            name_ru,
            name_ka,
            icon,
            link
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let { name_uz, name_ru, name_ka, icon, link } = req.body;
        const model = await TransportModel.findOne({ where: { id: req.params.id }} );

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        
        model.name_uz = name_uz;
        model.name_ru = name_ru;
        model.name_ka = name_ka;
        model.icon = icon;
        model.link = link;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await TransportModel.findOne({ where : { id: req.params.id } })
        
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
module.exports = new TransportController;