const ClientResumeModel = require('../models/clientResume.model');
const ClientModel = require("../models/client.model");
const AddressModel = require("../models/address.model");
const ClientJobModel = require("../models/clientJob.model");
const ClientJobChildModel = require("../models/clientJobChild.model")
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');

const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              resume Controller
 ******************************************************************************/
class ClientResumeController extends BaseController {

    getAll = async (req, res, next) => {
        let { job_id, job_type_id, sex_id, status } = req.body;
        let query = {};
        if (job_id) {
            query.job_id = job_id
        }
        if (job_type_id) {
            query.job_type_id = job_type_id
        }
        if (sex_id) {
            query.sex_id = sex_id
        }
        query.status = status;

        let modelList = await ClientResumeModel.findAll({
            attributes: [
                "surname", "name", "phone", "job_id", "job_type_id", "work_time", 'id', "salary",
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
                    model: AddressModel,
                    as: 'address',
                    attributes: ['name_uz'],
                    required: false
                },
                {
                    model: ClientJobModel,
                    as: 'job',
                    attributes: ['name_uz'],
                    required: false
                },
                {
                    model: ClientJobChildModel,
                    as: 'job_child',
                    attributes: ['name_uz'],
                    required: false
                }
            ],
            where: query,
            order: [
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };

    getById = async (req, res, next) => {
        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        const resume = await ClientResumeModel.findOne({
            where: { id: req.params.id },
            include: [

                {
                    model: AddressModel,
                    as: 'address',
                    attributes: ['name_' + lang],
                    required: false
                },
                {
                    model: ClientJobModel,
                    as: 'job',
                    attributes: ['name_' + lang],
                    required: false
                },
                {
                    model: ClientJobChildModel,
                    as: 'job_child',
                    attributes: ['name_' + lang],
                    required: false
                }
            ]
        });

        if (!resume) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(resume);
    };

    getOwnClient = async (req, res, next) => {
        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';
        let sexName = [
            {
                id: 2,
                name_uz: 'Erkak',
                name_ru: 'Мужской',
                name_ka: 'Мужской',
            },
            {
                id: 3,
                name_uz: 'Ayol',
                name_ru: 'Девушка',
                name_ka: 'Девушка',
            }
        ]
        const currentClient = req.currentClient.id;
        const resume = await ClientResumeModel.findAll({
            attributes: [
                'surname',
                'name',
                'sex_id',
                'phone',
                'salary',
                'work_time',
                [sequelize.literal(`address.name_${lang}`), 'address_name'],
                [sequelize.literal(`job.name_${lang}`), 'job_name'],
                [sequelize.literal(`job_child.name_${lang}`), 'job_child_name'],
            ],
            include: [

                {
                    model: AddressModel,
                    as: 'address',
                    attributes: [],
                    required: false
                },
                {
                    model: ClientJobModel,
                    as: 'job',
                    attributes: [],
                    required: false
                },
                {
                    model: ClientJobChildModel,
                    as: 'job_child',
                    attributes: [],
                    required: false
                }
            ],
            where: { client_id: currentClient },
            order: [['id', 'DESC']]
        });

        if (!resume) {
            throw new HttpException(404, req.mf('data not found'));
        }

        const mappedResume = resume.map(item => {
            const sex = sexName.find(sexItem => sexItem.id === item.sex_id);
            const sexNameTranslated = sex ? sex[`name_${lang}`] : null;

            return {
                ...item.get({ plain: true }),
                sex_name: sexNameTranslated
            };
        });

        res.send(mappedResume);
    }

    create = async (req, res, next) => {
        const currentClient = req.currentClient.id;

        let {
            surname,
            name,
            sex_id,
            phone,
            job_id,
            job_type_id,
            address_id,
            salary,
            work_time
        } = req.body;

        const model = await ClientResumeModel.create({
            surname: surname,
            name: name,
            sex_id: sex_id,
            phone: phone,
            job_id: job_id,
            job_type_id: job_type_id,
            address_id: address_id,
            salary: salary,
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
            job_id,
            job_type_id,
            address_id,
            salary,
            work_time,
            status
        } = req.body;
        const model = await ClientResumeModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.surname = surname;
        model.name = name;
        model.sex_id = sex_id;
        model.phone = phone;
        model.job_id = job_id;
        model.job_type_id = job_type_id;
        model.address_id = address_id;
        model.salary = salary;
        model.work_time = work_time;
        model.status = status;
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