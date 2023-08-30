const ReviewsModel = require('../models/reviews.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const moment = require('moment');
const fs = require('fs')
const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class ReviewsController extends BaseController { 

    getAll = async (req, res, next) => {    

        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';

        let modelList = await ReviewsModel.findAll({ 
            attributes: [
                'id', 'rating', 'image',
                [ sequelize.literal(`name_${lang}`), 'name' ],
                [ sequelize.literal(`comment_${lang}`), 'comment' ]
            ],
            order: [    
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const user = await ReviewsModel.findOne({
            where:{ id: req.params.id }
        });

        if (!user) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(user);
    };


    create = async (req, res, next) => {

        let { 
            image,
            comment_uz,
            comment_ru,
            comment_ka,
            name_uz,
            name_ru,
            name_ka,
            rating
        } = req.body;

        const model = await ReviewsModel.create({
            image,
            comment_uz,
            comment_ru,
            comment_ka,
            name_uz,
            name_ru,
            name_ka,
            rating
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        const model = await ReviewsModel.findOne({ where: { id: req.params.id }} );

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
            comment_uz,
            comment_ru,
            comment_ka,
            name_uz,
            name_ru,
            name_ka,
            rating
        } = req.body;
        

        model.comment_uz = comment_uz;
        model.comment_ru = comment_ru;
        model.comment_ka = comment_ka;
        model.name_uz = name_uz;
        model.name_ru = name_ru;
        model.name_ka = name_ka;
        model.rating = rating;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await ReviewsModel.findOne({ where : { id: req.params.id } })
        
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
            fs.unlinkSync('./uploads/reviews/' + image);
        } catch (error) {
            return 0;
        }
        return 1;
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ReviewsController;