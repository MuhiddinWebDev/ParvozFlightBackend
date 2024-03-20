const MenuTableModel = require('../models/menuTable.model');
const HttpException = require('../utils/HttpException.utils');
const UserModel = require('../models/user.model');
const UserTableModel = require('../models/userTable.model')
const BaseController = require('./BaseController');
const { Op } = require('sequelize');
const sequelize = require('../db/db-sequelize');
/******************************************************************************
 *                              model Controller
 ******************************************************************************/
class MenuTableController extends BaseController {

    getAll = async (req, res, next) => {
        let modelList = await MenuTableModel.findAll();
        res.send(modelList);
    };


    getById = async (req, res, next) => {
        const model = await MenuTableModel.findOne({
            where: { id: req.params.id }
        });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    create = async (req, res, next) => {
        const form_data = req.body
        const model = await MenuTableModel.create({
            title: form_data.title,
            name: form_data.name,
            icon: form_data.icon,
            status: form_data.status,
        });

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        await this.#addMenuUser(model.dataValues, 'create');

        res.status(201).send(model);
    };


    update = async (req, res, next) => {
        const form_data = req.body;
        const model = await MenuTableModel.findOne({ where: { id: req.params.id } });

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        model.title = form_data.title;
        model.name = form_data.name;
        model.icon = form_data.icon;
        model.statu = form_data.status;
        model.save();

        await this.#addMenuUser(model.dataValues, 'update');

        res.send(model);
    };


    delete = async (req, res, next) => {
        const model = await MenuTableModel.findOne({ where: { id: req.params.id } })

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        try {
            await UserTableModel.destroy({ where: { menu_id: model.id }, force: true })
            await model.destroy({ force: true });
        } catch (error) {
            await model.destroy();
        }

        res.send(req.mf('data has been deleted'));
    };

    #addMenuUser = async (model, action) => {
        const user_model = await UserModel.findAll();

        if (action == 'update') {
            await UserTableModel.destroy({ where: { menu_id: model.id }, force: true })

        }

        for (let i = 0; i < user_model.length; i++) {
            const element = user_model[i];
            const user_table = await UserTableModel.create({
                title: model.title,
                name: model.name,
                icon: model.icon,
                status: model.status,
                menu_id: model.id,
                user_id: element.id
            });
        };

    }

}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new MenuTableController;