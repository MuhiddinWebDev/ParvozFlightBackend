const ClientResumeModel = require('../models/clientResume.model');
const ClientModel = require("../models/client.model");
const ClientSalaryModel = require("../models/client_salary.model");
const WorkModel = require("../models/work.model")
const AddressModel = require("../models/address.model")
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              resume Controller
 ******************************************************************************/
class ClientResumeController extends BaseController {

    getAll = async (req, res, next) => {
        let modelList = await ClientResumeModel.findAll({
            attributes: [
                "surname", "name", "phone", "job", "work_time",'id',
                [sequelize.literal(`CASE WHEN client.sex_id = 2 THEN 'Erkak' WHEN client.sex_id = 3 THEN 'Ayol' END`), 'sex_type']
            ],                                    
            include: [
                {
                    model: ClientModel,
                    as: 'client',
                    attributes: ['name', 'fullname'],
                    required: false
                },
                {
                    model: ClientSalaryModel,
                    as: 'salary',
                    attributes: ['name_uz'],
                    required: false
                },
                {
                    model: WorkModel,
                    as: 'work',
                    attributes: ['title_uz'],
                    required: false
                },
                {
                    model: AddressModel,
                    as: 'address',
                    attributes: ['name_uz'],
                    required: false
                }
            ],
            order: [
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const resume = await ClientResumeModel.findOne({
            where: { id: req.params.id }
        });

        if (!resume) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(resume);
    };

    getOwnClient = async (req, res, next) => {
        const currentClient = req.currentClient.id;
        const resume = await ClientResumeModel.findOne({
            where: { client_id: currentClient },
            order: [['id', 'DESC']]
        });

        if (!resume) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(resume);
    }

    create = async (req, res, next) => {
        const currentClient = req.currentClient.id;

        let {
            surname,
            name,
            sex_id,
            phone,
            work_type_id,
            job,
            address_id,
            salary_id,
            work_time
        } = req.body;

        const model = await ClientResumeModel.create({
            surname: surname,
            name: name,
            sex_id: sex_id,
            phone: phone,
            work_type_id: work_type_id,
            job: job,
            address_id: address_id,
            salary_id: salary_id,
            work_time: work_time,
            client_id: currentClient
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let {
            surname,
            name,
            sex_id,
            phone,
            work_type_id,
            job,
            address_id,
            salary_id,
            work_time
        } = req.body;
        const model = await ClientResumeModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.surname = surname;
        model.name = name;
        model.sex_id = sex_id;
        model.phone = phone;
        model.work_type_id = work_type_id;
        model.job = job;
        model.address_id = address_id;
        model.salary_id = salary_id;
        model.work_time = work_time;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await ClientResumeModel.findOne({ where: { id: req.params.id } })

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
module.exports = new ClientResumeController;