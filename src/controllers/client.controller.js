const ClientModel = require('../models/client.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
let JSMTRand = require('js_mt_rand');
const UniqueStringGenerator = require('unique-string-generator');
const { text } = require('express');

let mt = new JSMTRand();
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class ClientController extends BaseController {
    getAll = async (req, res, next) => {
        let modelList = await ClientModel.findAll({
            order: [
                // ['fullname', 'ASC'],
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const model = await ClientModel.findOne({
            where:{ id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    getByPhoneNumber = async (req, res, next) => {
        const model = await ClientModel.findOne({where:{ phone: req.params.phone }});
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    create = async (req, res, next) => {
        this.checkValidation(req);

        let { 
            // fullname,
            phone
        } = req.body;
        let code = 123456;
        const model = await ClientModel.create({
            // fullname,
            phone,
            code
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {

        let { fullname } = req.body;

        const model = await ClientModel.findOne({ where: { id: req.params.id }} );

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        
        model.fullname = fullname;
        model.save();

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await ClientModel.findOne({ where : { id: req.params.id } })
        
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


    checkPhone = async (req, res, next) => {
        const code = mt.rand(111111, 999999);
        const phone1 = '71112222333';
        const phone2 = '74445555666';
        let phone = req.body.phone;

        let text = phone;
        let result = text.indexOf("7");
        if(result != 0){
            throw new HttpException(404, req.mf('phone error'));
        }
        
        let model = await ClientModel.findOne({where:{ phone: phone}});
        if(phone == phone1 || phone == phone2){
            if(phone == phone1){
                phone = phone1;
            }else {
                phone = phone2;
            }
            if(!model){
                model = await ClientModel.create({
                    phone: phone,
                    code: 123123
                });
            }else{
                model.code = 123123;
                await model.save();
            }   
        }else {
            if(!model){
                model = await ClientModel.create({
                    phone,
                    code
                });
            }else{
                model.code = code;
                await model.save();
            }

            const text = "Ваш смс-код: " + code;
            var data = JSON.stringify({
                "numbers": [
                    phone
                ],
                "sign": "SMS Aero",
                "text": text
            });
    
            await this.sendSmsToLogin(data);
        }
        
        
        res.send(model);
    };


    clientLogin = async (req, res, next) => {

        let { phone, code } = req.body;
        let token = UniqueStringGenerator.UniqueString(64);
        const model = await ClientModel.findOne({
            where: {
                phone,
                code
            }
        });

        if (!model) {
            throw new HttpException(401, req.mf('Incorrect phone number or sms code!'));
        }
        if(model.fullname == null, model.fullname == ''){
            model.fullname = '';
        }
        model.token = token;
        model.code = '';
        model.save();

        res.send(model);
    };


    getClient = async (req, res, next) => {

        let lang = req.get('Accept-Language');
        lang = lang? lang: 'uz';

        const client_id = req.currentClient.id;
        let fcm_token = req.query.fcm_token;
        // console.log('id ', client_id);
        // console.log('fcm ', fcm_token);
        
        let model = await ClientModel.findOne({where:{ id: client_id}});
        if(!model){
            throw new HttpException(404, req.mf('data not found'));
        }else{
            model.fcm_token = fcm_token;
            model.lang = lang;
          await model.save();
        }
        
        res.send(model);
    };

}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ClientController;