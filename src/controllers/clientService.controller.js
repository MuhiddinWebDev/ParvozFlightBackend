const ClientServiceModel = require('../models/clientService.model');
const ClientServiceChildModel = require("../models/client_service_child.model");
const ClientServiceRegisterModel = require("../models/client_service_register.model");
const StaticOrderModel = require("../models/static_order.model");
const WorkAddressModel = require('../models/work_address.model');
const ServiceModel = require('../models/services.model')
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class AdvertisementController extends BaseController {
    io;
    socket;
    socketConnect = (io, socket) => {
        this.io = io;
        this.socket = socket;
    };
    getAllMobile = async (req, res, next) => {
        let lang = req.get('Accept-Language');
        lang = lang ? lang : 'uz';

        let modelList = await ClientServiceModel.findAll({
            attributes: [
                "summa", "required", "id", 'disabled', 'service_id',
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
        let { region_id, service_id } = req.body;
        let query = {};
        if (region_id) {
            query.region_id = region_id
        }
        if(service_id){
            query.service_id = service_id
        }
        let modelList = await ClientServiceModel.findAll({
            include: [
                {
                    model: WorkAddressModel,
                    as: 'work_address',
                    required: false
                },
                {
                    model: ServiceModel,
                    as: 'service_type',
                    required: false
                }
            ],
            order: [
                ['id', 'ASC']
            ],
            where: query
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
        let data = []
        let { region_id, service_id } = req.body;
        let query = {};
        query.status = true;
        query.region_id = region_id;
        query.service_id = service_id;
        let modelList = await ClientServiceModel.findAll({
            attributes: [
                "summa", "required", "id", 'disabled', 'service_id',
                [sequelize.literal(`title_${lang}`), 'title'],
            ],
            where: query,
        });
       
        if(!modelList){
            res.send(data);
        }else{
            res.send(modelList);
        }
    };

    create = async (req, res, next) => {

        let {
            title_uz,
            title_ru,
            title_ka,
            summa,
            required,
            status,
            region_id,
            service_id
        } = req.body;

        const model = await ClientServiceModel.create({
            title_uz,
            title_ru,
            title_ka,
            summa,
            required,
            status,
            disabled: required,
            region_id,
            service_id
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };

    update = async (req, res, next) => {

        let { title_uz, title_ru, title_ka, summa, required, status, region_id, service_id } = req.body;
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
        model.service_id = service_id;

        model.save();

        res.send(model);
    };

    UploadFile = async (req, res, next) => {
        let { image } = req.body;

        try {
            if (!image) {
                throw new HttpException(405, req.mf("file type is invalid"));
            }

            const model = { image_name: image };
            res.send(model);
        } catch (error) {
            throw new HttpException(500, error.message);
        }
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
        const { client_service, region_id, total_sum, passport, migrant_carta, phone } = req.body;
        console.log(req.body)
        try {
            let model = await StaticOrderModel.create({
                client_id: currentClient.id,
                passport: passport,
                migrant_carta: migrant_carta,
                region_id: region_id,
                total_sum: total_sum,
                phone: phone,
                status: 'checking'
            })
            await client_service.forEach(async (item) => {
                if (item.required) {
                    let model_child = await ClientServiceChildModel.create({
                        doc_id: model.id,
                        client_service_id: item.id,
                        summa: item.summa
                    });
                    let register = await ClientServiceRegisterModel.create({
                        datetime: (new Date().getTime()) / 1000,
                        doc_id: model.id,
                        client_service_id: item.id,
                        client_id: currentClient.id,
                        region_id: region_id,
                        type: 0,
                        summa: item.summa,
                        doc_type: 'Chiqim',
                        place: "Mijozga xizmat"
                    })
                }
            });
            // const sockets = await this.io.fetchSockets();
            // for (const soc of sockets) {
            //     if (soc.dataUser.type == "User") {
            //         this.io.to(soc.id).emit("user_order", model)
            //     }
            // }
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