const ClientModel = require("../models/client.model");
const HttpException = require("../utils/HttpException.utils");
const BaseController = require("./BaseController");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret_jwt } = require("../startup/config");
const { Op } = require("sequelize");
let JSMTRand = require("js_mt_rand");
const UniqueStringGenerator = require("unique-string-generator");
const { text } = require("express");

var axios = require("axios");
const sequelize = require("../db/db-sequelize");
let mt = new JSMTRand();
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class ClientController extends BaseController {
  getAll = async (req, res, next) => {
    let modelList = await ClientModel.findAll({
      order: [["id", "DESC"]],
    });
    let sexOption = [
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
    for (let i = 0; i < modelList.length; i++) {
      let sexObject = sexOption.find(
        (sex) => sex.id === modelList[i].dataValues.sex_id
      );
      if (sexObject) {
        modelList[i].dataValues.sex_name = sexObject.name_uz;
      }
    }
    res.send(modelList);
  };

  getById = async (req, res, next) => {
    const model = await ClientModel.findOne({
      where: { id: req.params.id },
    });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(model);
  };

  currentClient = async (req, res, next) => {
    let client = req.currentClient;
    res.send(client);
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
    let { fullname, phone, password, age, sex_id, file_front, file_back, token, lang } = req.body;
    const model = await ClientModel.findOne({ where: { id: req.params.id } });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }
    const t = await sequelize.transaction();

    try {

      model.fullname = fullname;
      model.phone = phone;
      model.lang = lang;
      model.age = age;
      if (password) model.password = password;
      model.sex_id = sex_id;
      model.file_front = file_front;
      model.file_back = file_back;
      model.token = token;

      model.save();
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

      const model = { file_name: file };
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
      check: false
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
        code: code
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
    client.save();

    res.send(client);
  };
  hashPassword = async (req) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
  };
  #deleteFile = (file) => {
    try {
      fs.unlinkSync('./uploads/client/' + file);
    } catch (error) {
      return 0;
    }
    return 1;
  }
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ClientController();
