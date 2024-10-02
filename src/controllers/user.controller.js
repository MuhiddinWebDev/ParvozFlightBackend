const UserModel = require("../models/user.model");
const UserTableModel = require("../models/userTable.model");
const MenuTableModel = require("../models/menuTable.model")
const HttpException = require("../utils/HttpException.utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret_jwt } = require("../startup/config");
const BaseController = require("./BaseController");
const { MyUser, MainUser, Programmer } = require("../utils/userRoles.utils");
const { Op } = require("sequelize");
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController extends BaseController {
  getAll = async (req, res, next) => {
    let modelList = await UserModel.findAll({
      where: {
        id: { [Op.ne]: MyUser },
        deleted: false
      },
      order: [
        ["fullname", "ASC"],
        ["id", "ASC"],
      ],
    });
    res.send(modelList);
  };

  getSex = async (req, res, next) => {
    let lang = req.get("Accept-Language");
    lang = lang ? lang : "uz";

    let kal = `${lang}`.slice(15, 17);
    let result = [];
    let idx = req.params.id;
    let model = [
      {
        id: 1,
        name_uz: "Umumiy",
        name_ru: "Общий",
        name_ka: "Генерал",
      },
      {
        id: 2,
        name_uz: "Erkak",
        name_ru: "Мужской",
        name_ka: "Мард",
      },
      {
        id: 3,
        name_uz: "Ayol",
        name_ru: "Женский",
        name_ka: "Зан",
      },
    ];

    for (let i = 0; i < model.length; i++) {
      let el = model[i];

      if (idx && el.id != idx) {
        result.push({
          id: el.id,
          name: el["name_" + kal],
        });
      }
    }
    res.send(result);
  };

  getById = async (req, res, next) => {
    const user = await UserModel.findOne({
      include: [
        {
          model: UserTableModel,
          as: 'user_table',
          required: false
        }
      ],
      where: { id: req.params.id },
    });

    if (!user) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(user);
  };

  getByUsername = async (req, res, next) => {
    const user = await UserModel.findOne({
      where: { username: req.params.username },
    });
    if (!user) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(user);
  };

  getPhone = async (req, res, next) => {
    const user = await UserModel.findAll({
      attributes: ["phone"],
      where: { role: "Admin" },
    });
    if (!user) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(user);
  };

  getCurrentUser = async (req, res, next) => {
    res.send(req.currentUser);
  };

  create = async (req, res, next) => {
    await this.hashPassword(req);
    let { username, fullname, password, role, phone, all_page, user_table } = req.body;
    const model = await UserModel.create({
      username,
      fullname,
      password,
      role,
      phone,
      all_page
    });
    const filter_table = user_table.map((user) => ({
      ...user,
      user_id: model.id,
    }))

    await UserTableModel.bulkCreate(filter_table);

    if (!model) {
      throw new HttpException(500, req.mf("Something went wrong"));
    }

    res.status(201).send(model);
  };


  update = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);
    let { username, fullname, password, role, phone, all_page, user_table } = req.body;

    const model = await UserModel.findOne({ where: { id: req.params.id } });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    model.username = username;
    model.fullname = fullname;
    if (password) model.password = password;
    model.role = role;
    model.phone = phone;
    model.all_page = all_page;
    model.save();

    await this.#del_user_table(model.dataValues.id);

    const filter_table = user_table.map((user) => ({
      ...user,
      user_id: model.id,
    }))
    await UserTableModel.bulkCreate(filter_table);

    res.send(model);
  };

  delete = async (req, res, next) => {
    const model = await UserModel.findOne({ where: { id: req.params.id } });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    if (model.id === MainUser) {
      throw new HttpException(404, req.mf("O'chirish mumkin emas"));
    }
    try {
      model.deleted = !model.deleted;
      await model.save()
    } catch (error) {
      model.deleted = false;
    }

    res.send(req.mf("data has been deleted"));
  };

  userLogin = async (req, res, next) => {
    this.checkValidation(req);

    const { username, password: pass } = req.body;

    const user = await UserModel.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new HttpException(
        401,
        req.mf("Foydalnuvchi nomi yoki parol xato !!!")
      );
    }
    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new HttpException(
        401,
        req.mf("Foydalnuvchi nomi yoki parol xato !!!")
      );
    }
    if (user.deleted) {
      throw new HttpException(
        401,
        req.mf("Foydalanuvchi topilmadi")
      );
    }

    // user matched!
    const token = jwt.sign({ user_id: user.id.toString() }, secret_jwt, {
      expiresIn: "48h",
    });

    user.token = token;
    res.send(user);
  };

  // hash password if it exists
  hashPassword = async (req) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
  };

  #del_user_table = async (user_id) => {

    try {
      await UserTableModel.destroy(
        {
          where: { user_id: user_id },
          force: true
        }
      )
    } catch (err) {
      console.log(err)
    }
  }
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController();
