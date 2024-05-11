const ClientServiceModel = require('../models/clientService.model');
const ClientServiceTableModel = require("../models/client_service_table.model")
const ClientServiceChildModel = require("../models/client_service_child.model");
const WorkAddressModel = require('../models/work_address.model')
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class AdvertisementController extends BaseController {

    getAllMobile = async (req, res, next) => {
        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        let modelList = await ClientServiceModel.findAll({
            attributes: [
                "summa", "required", "id", 'disabled',
                [sequelize.literal(`title_${lang}`), 'title'],
            ],
            where: {
                status: true,
            },
            order: [
                ['id', 'DESC']
            ],
        });
        res.send(modelList);
    };


    getAllWeb = async (req, res, next) => {
        let modelList = await ClientServiceModel.findAll({
            include: [
                {
                    model: WorkAddressModel,
                    as: 'work_address',
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
        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        const model = await ClientServiceModel.findOne({
            where: { id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };

    getByRegion = async (req, res, next) => {
        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        let modelList = await ClientServiceModel.findAll({
            attributes: [
                "summa", "required", "id", 'disabled',
                [sequelize.literal(`title_${lang}`), 'title'],
            ],
            where: {
                status: true,
                region_id:req.params.id
            },
            order: [
                ['id', 'DESC']
            ],
        });
        res.send(modelList);
    };


    create = async (req, res, next) => {

        let {
            title_uz,
            title_ru,
            title_ka,
            summa,
            required,
            status,
            region_id
        } = req.body;

        const model = await ClientServiceModel.create({
            title_uz,
            title_ru,
            title_ka,
            summa,
            required,
            status,
            disabled: required,
            region_id
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let { title_uz, title_ru, title_ka, summa, required, status, region_id } = req.body;
        const model = await ClientServiceModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.title_uz = title_uz;
        model.title_ru = title_ru;
        model.title_ka = title_ka;
        model.summa = summa;
        model.required = required;
        model.disabled = required;
        model.status = status;
        model.region_id = region_id;

        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await ClientServiceModel.findOne({ where: { id: req.params.id } })

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

    orderByClient = async (req, res, next) => {
        const currentClient = req.currentClient;
        const { client_service, region_id, total_sum } = req.body;
        // let t = await sequelize.transaction();
        try {
            let model = await ClientServiceTableModel.create({
                client_id: currentClient.id,
                datetime: new Date().getTime() / 1000,
                region_id: region_id,
                total_sum: total_sum
            },)

            client_service.forEach(async (item) => {
                if (item.required) {
                    let model_child = await ClientServiceChildModel.create({
                        doc_id: model.id,
                        client_service_id: item.id,
                        summa: item.summa
                    })
                }
            })

            res.send(model)
        } catch (err) {
            throw new HttpException(404, err.message);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new AdvertisementController;