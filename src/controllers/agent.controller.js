const AgentModel = require('../models/agent.model');
const HttpException = require('../utils/HttpException.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');
const { Op } = require('sequelize');
const UniqueStringGenerator = require('unique-string-generator');
let JSMTRand = require('js_mt_rand');

let mt = new JSMTRand();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class AgentController extends BaseController {

    getAll = async (req, res, next) => {
        let modelList = await AgentModel.findAll({
            order: [
                ['id', 'DESC']
            ]
        });
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const model = await AgentModel.findOne({
            where:{ id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    checkCode = async (req, res, next) => {

        const model = await AgentModel.findOne({where:{ code: req.body.code}});
        
        if (!model) {
            throw new HttpException(404, req.mf('promocod not found'));
        }

        res.send(model);
    };



    // for promocode

    create = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);
        let { 
            name,
            password,
            phone,
            which_airline
        } = req.body;

        let code = mt.rand(111111111, 999999999);
        const model = await AgentModel.create({
            name,
            password,
            which_airline,
            phone,
            code
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };


    update = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);
        let { 
            name,
            password,
            which_airline,
            phone,
            code
        } = req.body;

        const model = await AgentModel.findOne({ where: { id: req.params.id }} );

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        
        model.name = name;
        if(password) model.password = password;
        model.which_airline = which_airline;
        model.phone = phone;
        model.code = code;
        model.save();

        res.send(model);
    };


    agentLogin = async (req, res, next) => {
        this.checkValidation(req);

        const { phone, password: pass } = req.body;

        const agent = await AgentModel.findOne({
            where: {
                phone
            }
        });
        
        if (!agent) {
            throw new HttpException(401, req.mf('Foydalnuvchi nomi yoki parol xato !!!'));
        }
        
        const isMatch = await bcrypt.compare(pass, agent.password);

        if (!isMatch) {
            throw new HttpException(401, req.mf('Foydalnuvchi nomi yoki parol xato !!!'));
        }

        // agent matched!
        const token = UniqueStringGenerator.UniqueString(64);

        agent.token = token;
        await agent.save();
        res.send(agent);
    };


    delete = async (req, res, next) => {
        const model = await AgentModel.findOne({ where : { id: req.params.id } })
        
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


    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new AgentController;