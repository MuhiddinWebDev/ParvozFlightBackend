const BannerModel = require('../models/banner.model');
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const moment = require('moment');
const fs = require('fs');
const sequelize = require('sequelize');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class BannerController extends BaseController { 

    getAll = async (req, res, next) => {    

        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';
        
        let modelList = await BannerModel.findAll({
            attributes: [
                'id','image','url',
                [ sequelize.literal(`description_${lang}`), 'description' ]
            ],
            order: [    
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        
        const banner = await BannerModel.findOne({
            where:{ id: req.params.id }
        });

        if (!banner) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(banner);
    };


    create = async (req, res, next) => {

        let { 
            image,
            description_uz,
            description_ru,
            description_ka,
            url
        } = req.body;

        const model = await BannerModel.create({
            image,
            description_uz,
            description_ru,
            description_ka,
            url
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        const model = await BannerModel.findOne({ where: { id: req.params.id }} );

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        let change_image = req.body.change_image;
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        let old_file = model.image;
        if (change_image == "true" || change_image == true) {
            model.image = req.body.image
            await this.#deleteBannerimg(old_file);
        } else {
            model.image = model.image;
        }

        let { 
            description_uz,
            description_ru,
            description_ka,
            url
        } = req.body;
        
        model.description_uz = description_uz;
        model.description_ru = description_ru;
        model.description_ka = description_ka;
        model.url = url;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await BannerModel.findOne({ where : { id: req.params.id } })
        
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        await this.#deleteBannerimg(model.image);

        try {
            await model.destroy({ force: true });
        } catch (error) {
            await model.destroy();
        }

        res.send(req.mf('data has been deleted'));
    };


    #deleteBannerimg = (image) => {
        try {
            fs.unlinkSync('./uploads/banner/' + image);
        } catch (error) {
            return 0;
        }
        return 1;
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new BannerController;