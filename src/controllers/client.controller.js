const ClientModel = require("../models/client.model");
const ClientTableModel = require("../models/clientTable.model");
const BonusModel = require("../models/bonus.model")
const HttpException = require("../utils/HttpException.utils");
const BaseController = require("./BaseController");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret_jwt } = require("../startup/config");
const { Op } = require("sequelize");
let JSMTRand = require("js_mt_rand");
const UniqueStringGenerator = require("unique-string-generator");
const { text } = require("express");
const fs = require('fs').promises;
var axios = require("axios");
const sequelize = require("../db/db-sequelize");
let mt = new JSMTRand();
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class ClientController extends BaseController {

  getAll = async (req, res, next) => {
    const filter = req.query;
    let query = {};
    if (filter.text) {
      query = {
        [Op.or]: [
          {
            fullname: {
              [Op.substring]: filter.text
            }
          },
          {
            phone: {
              [Op.substring]: filter.text
            }
          },
        ]
      }
    };
    let modelList = await ClientModel.findAll({
      attributes: [
        'id', 'fullname', 'phone', 'bonus', 'age', 'sex_id', 'code', 'lang',
        [sequelize.literal("CASE WHEN ClientModel.sex_id = 2 THEN 'Erkak'  ELSE 'Ayol' END"), 'sex_name'],
      ],
      where: query,
      order: [["id", "DESC"]],
    });
    res.send(modelList);
  };

  getById = async (req, res, next) => {
    const model = await ClientModel.findOne({
      include: [
        {
          model: ClientTableModel,
          as: 'client_table',
          required: false,
        }
      ],
      where: { id: req.params.id },
    });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(model);
  };

  currentClient = async (req, res, next) => {
    let client = req.currentClient;
    const model = await ClientModel.findOne({
      include: [
        {
          model: ClientTableModel,
          as: 'client_table',
          required: false,
        }
      ],
      where: { id: client.id },
    });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(model);
  };

  getByPhoneNumber = async (req, res, next) => {
    const model = await ClientModel.findOne({
      where: { phone: req.params.phone },
    });
    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(model);
  };

  create = async (req, res, next) => {
    this.checkValidation(req);

    let {
      // fullname,
      phone,
    } = req.body;
    let code = 123456;
    const model = await ClientModel.create({
      // fullname,
      phone,
      code,
    });

    if (!model) {
      throw new HttpException(500, req.mf("Something went wrong"));
    }

    res.status(201).send(model);
  };

  update = async (req, res, next) => {
    await this.hashPassword(req);
    let { fullname, phone, password, age, sex_id, file_front, file_back, token, lang, client_table } = req.body;
    const model = await ClientModel.findOne({ where: { id: req.params.id } });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }
    const t = await sequelize.transaction();

    try {

      model.fullname = fullname;
      model.phone = phone;
      model.lang = lang;
      model.age = age / 1000;
      if (password) model.password = password;
      model.sex_id = sex_id;
      model.file_front = file_front;
      model.file_back = file_back;
      model.token = token;
      await model.save();

      this.#deleteClient(model.id, req);

      for (let i = 0; i < client_table.length; i++) {
        try {
          let el = client_table[i];
          await ClientTableModel.create({
            client_id: model.id, // Ensure model.id is correctly defined
            file: el.file,
          });
        } catch (error) {
          console.error('Error creating ClientTableModel:', error);
        }
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
    }

    res.send(model);
  };

  getUploadFile = async (req, res, next) => {
    let { file } = req.body;

    try {
      if (!file) {
        throw new HttpException(405, req.mf("file type is invalid"));
      }

      const model = { file: file };
      res.send(model);
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  };

  delete = async (req, res, next) => {
    const model = await ClientModel.findOne({ where: { id: req.params.id } });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    try {
      await model.destroy({ force: true });
    } catch (error) {
      await model.destroy();
    }

    res.send(req.mf("data has been deleted"));
  };

  checkPhone = async (req, res, next) => {

    const code = mt.rand(111111, 999999);
    // const phone1 = "71112222333";
    // const phone2 = "74445555666";
    let phone = req.body.phone;
    let fcm = req.body.fcm;
    let model = await ClientModel.findOne({ where: { phone: phone } });
    let fcm_token = fcm;
    let title = "Ваш смс-код: " + code;
    let type = "login";
    let data = {
      check: false,
      code: code
    }
    if (!model) {
      data.check = false;
      var message = {
        to: fcm_token,
        notification: {
          title: title,
          type: type,
        },
      };
      await ClientModel.create({
        phone: phone,
        code: code,
        isLogin: false,
      })
      await this.notification(message);

      res.send(data);
    } else {
      model.code = code;
      await model.save();
      data.check = true
      res.send(data);
    }
    // let text_phone = phone;
    // let result_ru = text_phone.indexOf("7");
    // let result_uz = text_phone.indexOf("9");
    // if (result_uz == 0) {
    //   const urls = "https://send.smsxabar.uz/broker-api/send";
    //   const username = "parvozfly";
    //   const password = "A9ws0#L#[{j9";
    //   const encodedCredentials = btoa(username + ":" + password);
    //   await axios.default
    //     .post(
    //       urls,
    //       {
    //         messages: [
    //           {
    //             recipient: phone,
    //             "message-id": "abc000000001",

    //             sms: {
    //               originator: "3700",
    //               content: {
    //                 text: "Ваш смс-код: " + code,
    //               },
    //             },
    //           },
    //         ],
    //       },
    //       {
    //         headers: {
    //           Authorization: "Basic " + encodedCredentials,
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       if (response.data == "Request is received") {
    //         // res.send(data);
    //       } else {
    //         data.title = "Sms kod yuborishda xatolik";
    //         data.data = {};
    //         res.send(data);
    //       }
    //     });
    // } else if (result_ru == 0) {
    //   const text = "Ваш смс-код: " + code;
    //   var data = JSON.stringify({
    //     numbers: [phone],
    //     sign: "SMS Aero",
    //     text: text,
    //   });

    //   await this.sendSmsToLogin(data);
    // }

  };

  clientLogin = async (req, res, next) => {
    let { phone, code } = req.body;
    let token = UniqueStringGenerator.UniqueString(64);
    const bonus = await BonusModel.findOne();
    const model = await ClientModel.findOne({
      where: {
        phone,
        code,
      },
    });

    if (!model) {
      throw new HttpException(
        401,
        req.mf("Incorrect phone number or sms code!")
      );
    }
    if ((model.fullname == null, model.fullname == "")) {
      model.fullname = "";
    }
    model.token = token;
    model.isLogin = true;
    model.bonus = bonus.dataValues.summa;
    model.code = "";
    model.save();

    res.send(model);
  };

  getClient = async (req, res, next) => {
    let lang = req.get("Accept-Language");
    lang = lang ? lang : "uz";

    const client_id = req.currentClient.id;
    let fcm_token = req.query.fcm_token;


    let model = await ClientModel.findOne({ where: { id: client_id } });
    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    } else {
      model.fcm_token = fcm_token;
      model.lang = lang;
      await model.save();
    }
    res.send(model);
  };

  clientSignIn = async (req, res, next) => {
    this.checkValidation(req);
    const { phone, password: pass } = req.body;

    const client = await ClientModel.findOne({
      where: {
        phone,
      },
    });
    if (!client) {
      throw new HttpException(401, req.mf("Bu telefon raqam ro'yxatdan o'tmagan. Iltimos ro'yxatdan o'ting!!!"));
    }

    const isMatch = await bcrypt.compare(pass, client.password);

    if (!isMatch) {
      throw new HttpException(401, req.mf("Telefon raqam yoki parol xato !!!"));
    }

    let token = UniqueStringGenerator.UniqueString(64);

    client.token = token;
    client.isLogin = false;
    client.save();

    res.send(client);
  };

  hashPassword = async (req) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
  };

  #deleteClient = async (client_id, req) => {
    const model = await ClientTableModel.findAll({ where: { client_id: client_id } });

    try {
      if (model) {
        for (let i = 0; i < model.length; i++) {
          let el = model[i];
          await fs.unlink('./uploads/client/' + el.file);
          await el.destroy({ force: true });

        }
      }
    } catch (error) {
      if (model) {
        for (let i = 0; i < model.length; i++) {
          let el = model[i];
          await el.destroy({ force: true });
        }
      }

    }
  }
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ClientController();
