const WorkModel = require("../models/work.model");
const UserModel = require("../models/user.model");
const WorkTableModel = require("../models/workTable.model");
const ClientModel = require('../models/client.model')
const AddressModel = require("../models/address.model");
const HttpException = require("../utils/HttpException.utils");
const BaseController = require("./BaseController");
const sequelize = require("../db/db-sequelize");
const { Op } = require("sequelize");
/******************************************************************************
 *                              Work Controller
 ******************************************************************************/
class WorkController extends BaseController {
  getAll = async (req, res, next) => {
    let lang = req.get("Accept-Language");
    lang = lang ? lang : "uz";

    let modelList = await WorkModel.findAll({
      attributes: ["id", [sequelize.literal(`title_${lang}`), "title"]],
      order: [["id", "DESC"]],
    });
    res.send(modelList);
  };

  getAllWeb = async (req, res, next) => {
    const work = await WorkModel.findAll({
      include: [
        {
          model: WorkTableModel,
          as: "work_table",
          required: false,
        },
      ],
      order: [["id", "DESC"]],
    });

    if (!work) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(work);
  };

  getById = async (req, res, next) => {
    const work = await WorkModel.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: WorkTableModel,
          as: "work_table",
          required: false,
        },
      ],
    });

    if (!work) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(work);
  };

  getAllByIds = async (req, res, next) => {
    let lang = req.get("Accept-Language");
    lang = lang ? lang : "uz";

    let query = {};
    let body = req.body;
    let client = req.currentClient;

    query.status = "active";

    const date_birth = new Date();
    const client_age = new Date(client.age * 1000);
    // let result_age = date_birth.getFullYear() - client_age.getFullYear()


    if (client.sex_id) {
      query.sex_id = { [Op.in]: [1, client.sex_id] };
    }


    // if (result_age) {
    //   query.start_age = { [Op.lte]: result_age };
    //   query.end_age = { [Op.gte]: result_age };
    // }

    if (body.address_id) {
      query.address_id = body.address_id;
    }

    if (body.parent_id) {
      query.parent_id = body.parent_id;
    }

    const work = await WorkTableModel.findAll({
      attributes: [
        "id",
        "image",
        "parent_id",
        "from_price",
        "to_price",
        "phone",
        "lat",
        "long",
        "finished",
        [sequelize.literal(`WorkTableModel.title_${lang}`), "title"],
        [sequelize.literal(`price_type_${lang}`), "price_type"],
        [sequelize.literal(`comment_${lang}`), "comment"],
      ],
      include: [
        {
          model: AddressModel,
          attributes: ["id", [sequelize.literal(`address.name_${lang}`), "name"]],
          as: "address",
          required: false,
        },
        {
          model: WorkModel,
          attributes: ["id", [sequelize.literal(`work.title_${lang}`), "name"]],
          as: "work",
          required: false,
        },
      ],
      where: query,
      order: [["id", "DESC"]],
      required: false,
    });

    if (!work) {
      throw new HttpException(404, req.mf("data not found"));
    }



    res.send(work);
  };

  getAllProduct = async (req, res, next) => {
    let lang = req.get("Accept-Language");
    lang = lang ? lang : "uz";
    let client = req.currentClient;

    let query = {};
    if (client.sex_id) {
      query.sex_id = client.sex_id;
    }


    if (client.age) {
      query.start_age = { [Op.lte]: client.age };
      query.end_age = { [Op.gte]: client.age };
    }

    query.status = "active";

    const work_table = await WorkTableModel.findAll({
      attributes: [
        "id",
        "image",
        "from_price",
        "to_price",
        "phone",
        "lat",
        "long",
        "sex_id",
        "start_age",
        "end_age",
        "finished",
        [sequelize.literal(`title_${lang}`), "title"],
        [sequelize.literal(`price_type_${lang}`), "price_type"],
        [sequelize.literal(`comment_${lang}`), "comment"],
      ],
      include: [
        {
          model: AddressModel,
          attributes: [[sequelize.literal(`address.name_${lang}`), "name"]],
          as: "address",
          required: false,
        },
      ],
      where: query,
      order: [["id", "DESC"]],
    });

    if (!work_table) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(work_table);
  };

  getAllWebProduct = async (req, res, next) => {
    let filter = req.body;
    const currentUser = req.currentUser;
    let query = {};

    if (currentUser.role == 'User') {
      query.user_id = currentUser.id;
    }

    if (filter.user_id) {
      query.user_id = filter.user_id;
    }

    if (filter.client_id) {
      query.client_id = filter.client_id
    }
    if (filter.status) {

      if (filter.status == 'yes' || filter.status == 'no') {
        query.finished = filter.status;
      } else {
        query.status = filter.status;
      }
    }
    if (filter.address_id) {
      query.address_id = filter.address_id
    }
    if (filter.parent_id) {
      query.parent_id = filter.parent_id
    }
    let result = await WorkTableModel.findAll({
      attributes: [
        'user_id', 'client_id',
        'image', 'create_at', 'from_price',
        'to_price', 'phone', 'comment_uz',
        'finished', 'status', 'price_type_uz',
        'parent_id', 'start_age', 'end_age', 'end_date', 'id',
        'address_id',
        [sequelize.literal('WorkTableModel.title_uz'), 'title'],
        [sequelize.literal('user.fullname'), 'user_name'],
        [sequelize.literal('address.name_uz'), 'address_name'],
        [sequelize.literal('client.fullname'), 'client_fullname'],
        [sequelize.literal('client.name'), 'client_name'],
        [sequelize.literal('work.title_uz'), 'work_title'],
        [sequelize.literal('work.id'), 'cat_id'],
        [sequelize.literal("CASE WHEN WorkTableModel.sex_id = 1 THEN 'Umumiy' WHEN WorkTableModel.sex_id = 2 THEN 'Erkak' ELSE 'Ayol' END"), 'sex_name']
      ],
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: [],
          required: false,
        },
        {
          model: WorkModel,
          as: 'work',
          attributes: [],
          required: false
        },
        {
          model: AddressModel,
          as: 'address',
          attributes: [],
          required: false
        },
        {
          model: ClientModel,
          as: 'client',
          attributes: [],
          required: false,
        }
      ],
      where: query
    })
    // let sql = `
    //     SELECT 
    //         w.id AS cat_id, w.title_uz AS cat_name,
    //         wt.id, wt.parent_id, 
    //         wt.sex_id, wt.start_age, wt.end_age, wt.end_date,
    //         wt.title_uz AS title, 
    //         wt.from_price, wt.to_price, wt.phone, 
    //         wt.comment_uz AS comment, 
    //         wt.image, wt.status, 
    //         wt.price_type_uz AS price_type,
    //         wt.create_at, wt.address_id,
    //         address.name_uz as address_name,
    //         wt.lat, wt.long, wt.finished,
    //         user.fullname as user_name, client.fullname as client_name
    //     FROM work_table wt 
    //     LEFT JOIN works w ON w.id = wt.parent_id
    //     LEFT JOIN address ON wt.address_id = address.id
    //     LEFT JOIN client ON wt.client_id = client.id
    //     LEFT JOIN user ON wt.user_id = user.id
    // `;
    // if (query.status || query.user_id || query.client_id) {
    //   sql += " WHERE ";
    //   if (query.status) {
    //     sql += ` wt.status = '${query.status}' `;
    //   }
    //   if (query.status && (query.user_id || query.client_id)) {
    //     sql += ` AND `;
    //   }
    //   if (query.user_id) {
    //     sql += ` (wt.user_id = ${query.user_id} OR wt.client_id IS NOT NULL) `;
    //   }
    //   if (query.user_id && query.client_id) {
    //     sql += ` AND `;
    //   }
    //   if (query.finished) {
    //     console.log('text_____________________--')
    //     sql += ` AND wt.finished = ${query.finished} `;
    //   }
    //   if (query.client_id) {
    //     sql += ` wt.client_id = ${query.client_id} `;
    //   }
    // }
    // sql += " ORDER BY wt.createdAt DESC";

    // let result = await sequelize.query(sql, {
    //   type: sequelize.QueryTypes.SELECT,
    //   raw: true,
    // });
    // let sex_model = [
    //   {
    //     id: 1,
    //     name_uz: "Umumiy",
    //   },
    //   {
    //     id: 2,
    //     name_uz: "Erkak",
    //   },
    //   {
    //     id: 3,
    //     name_uz: "Ayol",
    //   },
    // ];
    // result.forEach((row) => {
    //   let sexObject = sex_model.find((sex) => sex.id === row.sex_id);
    //   if (sexObject) {
    //     row.sex_name = sexObject.name_uz;
    //   }
    // });

    // if (!result) {
    //   throw new HttpException(404, req.mf("data not found"));
    // }

    res.send(result);
  };

  testWorkTable = async (req, res, next) => {
    let model = await WorkTableModel.findAll({
      attributes: [
        'image', 'create_at', 'from_price',
        'to_price', 'phone', 'comment_uz',
        'finished', 'status', 'price_type_uz',
        'parent_id', 'start_age', 'end_age', 'end_date', 'id',
        [sequelize.literal('WorkTableModel.title_uz'), 'title'],
        [sequelize.literal('user.fullname'), 'user_name'],
        [sequelize.literal('address.name_uz'), 'address_name'],
        [sequelize.literal('client.fullname'), 'client_fullname'],
        [sequelize.literal('client.name'), 'client_name'],
        [sequelize.literal('work.title_uz'), 'work_title'],
        [sequelize.literal('work.id'), 'cat_id'],
        [sequelize.literal("CASE WHEN WorkTableModel.sex_id = 1 THEN 'Umumiy' WHEN WorkTableModel.sex_id = 2 THEN 'Erkak' ELSE 'Ayol' END"), 'sex_name']
      ],
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: [],
          required: false
        },
        {
          model: WorkModel,
          as: 'work',
          attributes: [],
          required: false
        },
        {
          model: AddressModel,
          as: 'address',
          attributes: [],
          required: false
        },
        {
          model: ClientModel,
          as: 'client',
          attributes: [],
          required: false
        }
      ]
    })
    res.send(model)
  }

  getByIdProduct = async (req, res, next) => {
    let product_id = req.params.id;
    let sql = `
        SELECT 
            wt.id, wt.parent_id,
            wt.sex_id, wt.start_age, wt.end_age, wt.end_date,
            wt.title_uz, wt.title_ru, wt.title_ka, 
            wt.from_price, wt.to_price, wt.phone, 
            wt.comment_uz, wt.comment_ru, wt.comment_ka, 
            wt.image, wt.status, 
            wt.price_type_uz, wt.price_type_ru, wt.price_type_ka,
            wt.create_at, wt.address_id,
            wt.lat, wt.long, wt.finished
        FROM work_table wt 
        LEFT JOIN works w ON w.id = wt.parent_id
        WHERE wt.id = :product_id
        ORDER BY wt.id `;
    let result = await sequelize.query(sql, {
      replacements: {
        product_id,
      },
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    if (!result) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(result);
  };

  getUploadImage = async (req, res, next) => {
    let { image } = req.body;

    try {
      if (!image) {
        throw new HttpException(500, "image type is invalid");
      }
      const name = {
        name: image,
      };

      res.send(name);
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  };

  getUploadImageMobil = async (req, res, next) => {
    let { image } = req.body;

    try {
      if (!image) {
        throw new HttpException(500, "image type is invalid");
      }
      const name = {
        image_name: image,
      };

      res.send(name);
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  };

  create = async (req, res, next) => {
    let { work_table, work_id } = req.body;
    const currentUser = req.currentUser;
    let t = await sequelize.transaction();

    try {
      const work = await WorkModel.findOne({
        where: { id: work_id },
      });

      if (!work) {
        throw new HttpException(404, req.mf("data not found"));
      }

      for (let i = 0; i < work_table.length; i++) {
        const element = work_table[i];

        await WorkTableModel.create(
          {
            parent_id: work_id,
            parent_id: work_id,
            title_uz: element.title_uz,
            title_ru: element.title_ru,
            title_ka: element.title_ka,
            comment_uz: element.comment_uz,
            comment_ru: element.comment_ru,
            comment_ka: element.comment_ka,
            image: element.image,
            from_price: element.from_price,
            to_price: element.to_price,
            phone: element.phone,
            address_id: element.address_id,
            lat: element.lat,
            long: element.long,
            create_at: element.create_at,
            price_type_uz: element.price_type_uz,
            price_type_ru: element.price_type_ru,
            price_type_ka: element.price_type_ka,
            sex_id: element.sex_id,
            end_date: element.end_date / 1000,
            start_age: element.start_age,
            end_age: element.end_age,
            user_id: currentUser.id
          },
          { transaction: t }
        );
      }

      await t.commit();
      const modelx = await WorkModel.findOne({
        where: { id: work_id },
        include: [
          {
            model: WorkTableModel,
            as: "work_table",
            required: false,
          },
        ],
      });

      res.send(modelx);
    } catch (error) {
      await t.rollback();
      throw new HttpException(401, error.message);
    }
  };

  createWork = async (req, res, next) => {
    let { ...work_table } = req.body;
    const currentClient = req.currentClient;
    const currenDate = new Date().getTime();
    let t = await sequelize.transaction();
    try {
      const model = await WorkTableModel.create(
        {
          parent_id: work_table.parent_id,
          title_uz: work_table.title_uz,
          title_ru: work_table.title_ru,
          title_ka: work_table.title_ka,
          comment_uz: work_table.comment_uz,
          comment_ru: work_table.comment_ru,
          comment_ka: work_table.comment_ka,
          image: work_table.image,
          from_price: work_table.from_price,
          to_price: work_table.to_price,
          phone: work_table.phone,
          address_id: work_table.address_id,
          lat: work_table.lat,
          long: work_table.long,
          create_at: work_table.create_at,
          price_type_uz: work_table.price_type_uz,
          price_type_ru: work_table.price_type_ru,
          price_type_ka: work_table.price_type_ka,
          sex_id: work_table.sex_id,
          end_date: (currenDate + 86400) / 1000,
          start_age: work_table.start_age,
          end_age: work_table.end_age,
          client_id: currentClient.id,
          user_id: null
        },
        { transaction: t }
      );

      await t.commit();

      res.send(model);
    } catch (error) {
      await t.rollback();
      throw new HttpException(401, error.message);
    }
  };

  createCategory = async (req, res, next) => {
    let { title_uz, title_ru, title_ka } = req.body;
    // console.log('title ', title_uz);

    let t = await sequelize.transaction();

    try {
      const model = await WorkModel.create(
        {
          title_uz: title_uz,
          title_ru: title_ru,
          title_ka: title_ka,
        },
        { transaction: t }
      );

      if (!model) {
        throw new HttpException(500, req.mf("Something went wrong"));
      }

      await t.commit();
      res.send(model);
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };

  update = async (req, res, next) => {
    let { work_table } = req.body;
    const model = await WorkModel.findOne({ where: { id: req.params.id } });
    const currentUser = req.currentUser
    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    let t = await sequelize.transaction();

    try {
      await this.#deleteRelated(model.id);

      for (let i = 0; i < work_table.length; i++) {
        const element = work_table[i];

        await WorkTableModel.create(
          {
            parent_id: model.id,
            title_uz: element.title_uz,
            title_ru: element.title_ru,
            title_ka: element.title_ka,
            comment_uz: element.comment_uz,
            comment_ru: element.comment_ru,
            comment_ka: element.comment_ka,
            image: element.image,
            lat: element.lat,
            long: element.long,
            from_price: element.from_price,
            to_price: element.to_price,
            phone: element.phone,
            address_id: element.address_id,
            sex_id: element.sex_id,
            end_date: element.end_date / 1000,
            start_age: element.start_age,
            end_age: element.end_age,
          },
          { transaction: t }
        );
      }

      await t.commit();

      const modelx = await WorkModel.findOne({
        where: { id: model.id },
        include: [
          {
            model: WorkTableModel,
            as: "work_table",
            required: false,
          },
        ],
      });

      res.send(modelx);
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };

  updateProduct = async (req, res, next) => {
    let { ...work_table } = req.body;
    let model = await WorkTableModel.findOne({ where: { id: req.params.id } });
    const currentUser = req.currentUser
    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }
    let t = await sequelize.transaction();
    let currentDay = new Date().getTime() / 1000;
    let oldDay = work_table.end_date / 1000;
    let allowChange = currentDay < oldDay
    try {
      model.address_id = work_table.address_id;
      model.parent_id = work_table.parent_id;
      model.title_uz = work_table.title_uz;
      model.title_ru = work_table.title_ru;
      model.title_ka = work_table.title_ka;
      model.comment_uz = work_table.comment_uz;
      model.comment_ru = work_table.comment_ru;
      model.comment_ka = work_table.comment_ka;
      model.price_type_uz = work_table.price_type_uz;
      model.price_type_ru = work_table.price_type_ru;
      model.price_type_ka = work_table.price_type_ka;
      model.image = work_table.image;
      model.from_price = work_table.from_price;
      model.to_price = work_table.to_price;
      model.phone = work_table.phone;
      model.lat = work_table.lat;
      model.long = work_table.long;
      model.status = work_table.status;
      model.sex_id = work_table.sex_id;
      model.end_date = work_table.end_date / 1000;
      model.start_age = work_table.start_age;
      model.end_age = work_table.end_age;
      model.finished = allowChange ? 'no' : 'yes';
      await model.save();


      await t.commit();

      const modelx = await WorkTableModel.findOne({
        where: { id: model.id },
      });

      res.send(modelx);
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };

  updateCategory = async (req, res, next) => {
    let { ...works } = req.body;

    const model = await WorkModel.findOne({ where: { id: req.params.id } });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    let t = await sequelize.transaction();
    try {
      model.title_uz = works.title_uz;
      model.title_ru = works.title_ru;
      model.title_ka = works.title_ka;
      await model.save();

      await t.commit();

      const modelx = await WorkModel.findOne({
        where: { id: model.id },
      });

      res.send(modelx);
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };

  delete = async (req, res, next) => {
    const model = await WorkModel.findOne({ where: { id: req.params.id } });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    try {
      await this.#deleteRelated(model.id);
      await model.destroy({ force: true });
    } catch (error) {
      await this.#deleteRelated(model.id);
      await model.destroy();
    }

    res.send(req.mf("data has been deleted"));
  };

  deleteProduct = async (req, res, next) => {
    const model = await WorkTableModel.findOne({
      where: { id: req.params.id },
    });

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

  sendMobilNotifaction = async (req, res, next) => {
    let model = await WorkTableModel.findOne({ where: { id: req.params.id } });
    try {
      let message = {
        text: "Barch mijozlarga yuborildi"
      }
      await this.#senWork(model.dataValues);

      res.send(message)

    } catch (err) {
      console.log(err)
    }
  }


  #senWork = async (model) => {
    let query = {};

    if (model.sex_id == 1) {
      query.sex_id = { [Op.in]: [2, 3] };
    } else {
      query.sex_id = model.sex_id;
    }

    let address = await AddressModel.findOne({
      where: { id: model.address_id }
    });

    let workData = {
      new_uz: 'Yangi ish',
      new_ru: 'Новая работа',
      new_ka: 'Кори нав',
      couse_uz: 'uchun',
      couse_ru: 'Для',
      couse_ka: 'Барои',
      salary_uz: "Ish haqi: ",
      salary_ru: "Зарплата ",
      salary_ka: 'Маош ',
      from_uz: " dan ",
      from_ru: 'от: ',
      from_ka: 'аз: ',
      to_uz: ' gacha ',
      to_ru: ' до: ',
      to_ka: ' то: ',
      sex_uz_1: 'Hamma',
      sex_uz_2: 'Erkaklar',
      sex_uz_3: 'Ayollar',
      sex_ru_1: 'Все',
      sex_ru_2: 'мужчины',
      sex_ru_3: 'женщины',
      sex_ka_1: 'ҳама',
      sex_ka_2: 'мардон',
      sex_ka_3: 'занон',
      addres_uz:'Manzil',
      addres_ru:'Адрес',
      addres_ka:'Адрес',
    };

    if (model.status == 'active') {
      let clients = await ClientModel.findAll({
        where: query,
        raw: true
      });
      for (let i = 0; i < clients.length; i++) {
        let element = clients[i];
        let lang = element.lang;
        // Construct the title
        let currentTitle = `${workData['new_' + lang]} ${model['title_' + lang]}`;

        // Construct the body
        let currentBody = "";

        // Add the address if available
        // if (address) {
        //   currentBody += `\n`+ `;
        // }
        if(lang != 'uz'){
          currentBody = `${workData['couse_' + lang]} ${workData['sex_' + lang + '_' + element.sex_id]}
          ${workData['salary_' + lang]}${workData['from_' + lang]}${model.from_price} ${workData['to_' + lang]}${model.to_price}
          ${workData['addres_' + lang]} ${address.dataValues['name_' + lang]}`;
        }else{
          currentBody = `${workData['sex_' + lang + '_' + element.sex_id]} ${workData['couse_' + lang]} 
          ${workData['salary_' + lang]} ${model.from_price} ${workData['from_' + lang]}  ${model.to_price} ${workData['to_' + lang]}
          ${workData['addres_' + lang]} ${address.dataValues['name_' + lang]}`;
        }

        let message = {
          to: element.fcm_token,
          notification: {
            title: currentTitle,
            type: "work",
            data: model.id,
            body: currentBody
          },
          data: {
            payload: "work",
            groupKey: model.id,
            bigPicture: null
          }
        };

        console.log(message);
        await this.notification(message);
      }
    }

  }


  #deleteRelated = async (parent_id) => {

    let work_table = WorkTableModel.findAll({
      where: { parent_id: parent_id },
    });

    if (work_table) {
      await WorkTableModel.destroy(
        {
          where: { parent_id: parent_id },
          force: true,
        },
        { transaction: t }
      );
    } else {
      await WorkTableModel.destroy(
        {
          where: { parent_id: parent_id },
          force: true,
        },
        { transaction: t }
      );
    }
  };
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new WorkController();
