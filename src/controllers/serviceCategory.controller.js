const ServiceCategoryModel = require('../models/serviceCategory.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
const { Op } = require('sequelize');
let JSMTRand = require('js_mt_rand');
const fs = require('fs')

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class ServiceCategoryController extends BaseController {

    getAll = async (req, res, next) => {

        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';
        let modelList = await ServiceCategoryModel.findAll({
            attributes: [
                'id',
                [ sequelize.literal(`k_name_${lang}`), 'name' ],
                [ sequelize.literal(`k_image`), 'image' ]
            ],
            order: [
                ['id', 'DESC']
            ]
        });
        res.send(modelList);
    };


    getAllWeb = async (req, res, next) => {
        let modelList = await ServiceCategoryModel.findAll({
            order: [
                ['id', 'DESC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const model = await ServiceCategoryModel.findOne({
            where:{ id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    // for promocode
    create = async (req, res, next) => {
        let {
            k_name_uz,
            k_name_ru,
            k_name_ka,
            k_image
        } = req.body;

        try {
            let model = await ServiceCategoryModel.create({
                k_name_uz: k_name_uz, 
                k_name_ru: k_name_ru, 
                k_name_ka: k_name_ka, 
                k_image: k_image
            });

            res.send(model);
        } catch (error) {
            throw new HttpException(500, error.message)
        }
    };


    update = async (req, res, next) => {

        let {
            k_name_uz,
            k_name_ru,
            k_name_ka
        } = req.body;

        const model = await ServiceCategoryModel.findOne({ where: { id: req.params.id }} );

        let change_image = req.body.change_image;
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        try {
            
            let old_file = model.k_image;
            if (change_image == "true" || change_image == true) {
                model.k_image = req.body.k_image;
                await this.#deleteBannerimg(old_file);
            } else {
                model.k_image = model.k_image;
                await this.#deleteBannerimg(req.body.k_image);
            }
        
            model.k_name_uz = k_name_uz, 
            model.k_name_ru = k_name_ru, 
            model.k_name_ka = k_name_ka, 
            await model.save();

            res.send(model);
        } catch (error) {
            throw new HttpException(500, error.message)
        }
    };


    delete = async (req, res, next) => {
        const model = await ServiceCategoryModel.findOne({ where : { id: req.params.id } })
        
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


    #deleteBannerimg = (old_file) => {
        try {
            fs.unlinkSync('./uploads/category/' + old_file);
        } catch (error) {
            return 0;
        }
        return 1;
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ServiceCategoryController;