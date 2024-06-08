const ClientSalaryModel = require('../models/client_salary.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class AddressController extends BaseController { 

    getAll = async (req, res, next) => {    
        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';

        let modelList = await ClientSalaryModel.findAll({ 
            attributes: [
                'id',
                [ sequelize.literal(`name_${lang}`), 'name' ]
            ],
            order: [    
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const user = await ClientSalaryModel.findOne({
            where:{ id: req.params.id }
        });

        if (!user) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(user);
    };


    create = async (req, res, next) => {

        let { 
            name_uz,
            name_ru,
            name_ka
        } = req.body;

        const model = await ClientSalaryModel.create({
            name_uz,
            name_ru,
            name_ka
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let { name_uz, name_ru, name_ka } = req.body;
        const model = await ClientSalaryModel.findOne({ where: { id: req.params.id }} );

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        
        model.name_uz = name_uz;
        model.name_ru = name_ru;
        model.name_ka = name_ka;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await ClientSalaryModel.findOne({ where : { id: req.params.id } })
        
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
module.exports = new AddressController;