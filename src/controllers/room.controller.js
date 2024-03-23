const RoomModel = require("../models/room.model");
const RoomTableModel = require("../models/roomTable.model");
const ClientModel = require("../models/client.model");
const RoomImageModel = require("../models/roomImage.model");
const AddressModel = require("../models/address.model");
const HttpException = require("../utils/HttpException.utils");
const BaseController = require("./BaseController");
const sequelize = require("../db/db-sequelize");
const fs = require("fs");
const { Op } = require("sequelize");
/******************************************************************************
 *                              Services Controller
 ******************************************************************************/
class ServicesController extends BaseController {
  getAll = async (req, res, next) => {
    let lang = req.get("Accept-Language");
    lang = lang ? lang : "uz";

    let modelList = await RoomModel.findAll({
      attributes: ["id", [sequelize.literal(`name_${lang}`), "name"]],
      order: [["id", "DESC"]],
    });
    res.send(modelList);
  };

  getDetail = async (req, res, next) => {
    let lang = req.get("Accept-Language");
    lang = lang ? lang : "uz";
    let body = req.body;
    let client = req.currentClient;

    let query = {};
    query.status = "empty";

    if (body.address_id) {
      query.address_id = body.address_id;
    }

    if (body.parent_id) {
      query.parent_id = body.parent_id;
    }
    if (client) {
      query.sex_id = { [Op.in]: [1, client.sex_id] };
    }

    const modelList = await RoomTableModel.findAll({
      where: query,
      attributes: [
        "id",
        "parent_id",
        "price",
        "phone_number",
        "area",
        "status",
        "lat",
        "long",
        "sex_id",
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
          model: RoomImageModel,
          as: "images",
          attributes: ["id", "image", "parent_id"],
          required: false,
        },
        {
          model: RoomModel,
          attributes: [
            "id",
            [sequelize.literal(`room.name_${lang}`), "name"]
          ],
          as: 'room',
          required: false
        }
      ],
      order: [["id", "DESC"]],
    });

    if (!modelList) {
      throw new HttpException(404, req.mf("data not found"));
    }



    res.send(modelList);
  };

  getById = async (req, res, next) => {
    const service = await RoomModel.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: RoomTableModel,
          as: "room_table",
          required: false,
          include: [
            {
              model: RoomImageModel,
              as: "images",
              required: false,
            },
          ],
        },
      ],
    });

    if (!service) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(service);
  };

  getAllWebTable = async (req, res, next) => {
    let filter = req.body;
    let currentUser = req.currentUser;
    const query = {};
    if (currentUser.role == 'User') {
      query.user_id = currentUser.id;
    }
    if (filter.user_id) {
      query.user_id = filter.user_id;
    }
    let sql = ` 
    SELECT 
        rt.id, rt.parent_id, 
        r.name_uz AS name_uz, r.name_ru AS name_ru, r.name_ka AS name_ka,
        rt.price, rt.phone_number, 
        rt.comment_uz, rt.comment_ru, 
        rt.comment_ka, rt.area, rt.status, 
        ad.name_uz AS address_uz, rt.sex_id
    FROM room_table rt 
        LEFT JOIN room r ON rt.parent_id = r.id
        LEFT JOIN address ad ON rt.address_id = ad.id`;

    if (filter.status || filter.sex_id) {
      sql += " WHERE ";
      if (filter.status) {
        sql += `rt.status = '${filter.status}'`;
      }
      if (filter.status && filter.sex_id) {
        sql += " AND ";
      }
      if (filter.sex_id) {
        sql += `rt.sex_id = ${filter.sex_id}`;
      }
      if (query?.user_id) {
        sql += ` AND rt.user_id = ${query.user_id}`
      }
    } else {
      if (query.user_id) {
        sql += ` WHERE  rt.user_id = ${query.user_id}`
      }
    }

    sql += " ORDER BY rt.id DESC";

    let result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });
    let sexOption = [
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

    for (let i = 0; i < result.length; i++) {
      const model = await RoomImageModel.findAll({
        where: {
          parent_id: result[i].id,
        },
      });
      let sexObject = sexOption.find((sex) => sex.id === result[i].sex_id);

      if (sexObject) {
        result[i].sex_name = sexObject.name_uz;
      }
      result[i].images = model;
    }

    res.send(result);
  };

  getByIdTable = async (req, res, next) => {
    let room_id = req.params.id;

    let sql = ` SELECT 
            rt.id, rt.parent_id, 
            r.name_uz AS name_uz, r.name_ru AS name_ru, r.name_ka AS name_ka,
            rt.price, rt.phone_number, 
            rt.comment_uz, rt.comment_ru, rt.comment_ka, 
            rt.area, rt.status, rt.lat, rt.long, rt.address_id, rt.sex_id
        FROM room_table rt 
        LEFT JOIN room r ON rt.parent_id = r.id WHERE rt.id = :room_id
        ORDER BY rt.id DESC `;

    let result = await sequelize.query(sql, {
      replacements: {
        room_id,
      },
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    if (!result) {
      throw new HttpException(404, req.mf("data not found"));
    }
    for (let i = 0; i < result.length; i++) {
      const model = await RoomImageModel.findAll({
        where: {
          parent_id: result[i].id,
        },
      });
      result[i].images = model;
    }

    res.send(result);
  };

  createImage = async (req, res, next) => {
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

  updateImage = async (req, res, next) => {
    let { image, parent_id, id } = req.body;

    let model = await RoomImageModel.findOne({
      where: { id, parent_id },
    });
    if (!model) {
      throw new HttpException(404, "Room Table not found");
    }

    try {
      if (!image) {
        throw new HttpException(500, "image type is invalid");
      }
      const name = {
        image_name: image,
      };
      await this.#deleteRoomImage(model.image);
      res.send(name);
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  };

  create = async (req, res, next) => {
    let services = req.body;

    let t = await sequelize.transaction();

    try {
      const model = await RoomModel.create(
        {
          name_uz: services.name_uz,
          name_ru: services.name_ru,
          name_ka: services.name_ka,
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
    let services = req.body;

    const model = await RoomModel.findOne({ where: { id: req.params.id } });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    let t = await sequelize.transaction();
    try {
      model.name_uz = services.name_uz;
      model.name_ru = services.name_ru;
      model.name_ka = services.name_ka;
      await model.save();

      await t.commit();

      res.send(model);
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };

  createTable = async (req, res, next) => {
    let { images, ...room_table } = req.body;
    const currentUser = req.currentUser;
    let t = await sequelize.transaction();

    try {
      const model = await RoomModel.findOne({
        where: { id: req.body.parent_id },
      });

      if (!model) {
        throw new HttpException(500, req.mf("room not found"));
      }

      const model_table = await RoomTableModel.create(
        {
          parent_id: room_table.parent_id,
          address_id: room_table.address_id,
          price: room_table.price,
          sex_id: room_table.sex_id,
          phone_number: room_table.phone_number,
          comment_uz: room_table.comment_uz,
          comment_ru: room_table.comment_ru,
          comment_ka: room_table.comment_ka,
          area: room_table.area,
          status: room_table.status,
          lat: room_table.lat,
          long: room_table.long,
          user_id: currentUser.id
        },
        { transaction: t }
      );

      for (let i = 0; i < images.length; i++) {
        const element = images[i];
        await RoomImageModel.create(
          {
            parent_id: model_table.id,
            image: element.image,
          },
          { transaction: t }
        );
      }
      await t.commit();
      const modelx = await RoomModel.findOne({
        where: { id: model.id },
        include: [
          {
            model: RoomTableModel,
            as: "room_table",
            required: false,
            where: { id: model_table.id },
            include: [
              {
                model: RoomImageModel,
                as: "images",
                required: false,
              },
            ],
          },
        ],
      });
      this.#sendRoom(model_table.dataValues)

      res.send(modelx);
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };

  createTableMobil = async (req, res, next) => {
    let { images, ...room_table } = req.body;
    const currentClient = req.currentClient
    let t = await sequelize.transaction();

    try {
      const model = await RoomModel.findOne({
        where: { id: req.body.parent_id },
      });

      if (!model) {
        throw new HttpException(500, req.mf("room not found"));
      }

      const model_table = await RoomTableModel.create(
        {
          parent_id: room_table.parent_id,
          address_id: room_table.address_id,
          sex_id: room_table.sex_id,
          price: room_table.price,
          phone_number: room_table.phone_number,
          comment_uz: room_table.comment_uz,
          comment_ru: room_table.comment_ru,
          comment_ka: room_table.comment_ka,
          area: room_table.area,
          status: room_table.status,
          lat: room_table.lat,
          long: room_table.long,
          client_id: currentClient.id
        },
        { transaction: t }
      );

      for (let i = 0; i < images.length; i++) {
        const element = images[i];

        await RoomImageModel.create(
          {
            parent_id: model_table.id,
            image: element.image,
          },
          { transaction: t }
        );
      }
      await t.commit();

      const modelx = await RoomModel.findOne({
        where: { id: model.id },
        include: [
          {
            model: RoomTableModel,
            as: "room_table",
            required: false,
            where: { id: model_table.id },
            include: [
              {
                model: RoomImageModel,
                as: "images",
                required: false,
              },
            ],
          },
        ],
      });

      this.#sendRoom(model_table.dataValues)

      res.send(modelx);
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };

  updateTable = async (req, res, next) => {
    let { images, ...room_table } = req.body;
    // let images = room_table.images;
    let t = await sequelize.transaction();

    try {
      const model = await RoomModel.findOne({
        where: { id: req.body.parent_id },
      });

      const model_table = await RoomTableModel.findOne({
        where: { id: req.params.id },
      });

      if (!model || !model_table) {
        throw new HttpException(500, req.mf("room or room table not found"));
      }

      model_table.parent_id = room_table.parent_id;
      (model_table.address_id = room_table.address_id),
        (model_table.address_uz = room_table.address_uz);
      model_table.address_ru = room_table.address_ru;
      model_table.address_ka = room_table.address_ka;
      model_table.price = room_table.price;
      model_table.phone_number = room_table.phone_number;
      model_table.comment_uz = room_table.comment_uz;
      model_table.comment_ru = room_table.comment_ru;
      model_table.comment_ka = room_table.comment_ka;
      model_table.area = room_table.area;
      model_table.status = room_table.status;
      model_table.lat = room_table.lat;
      model_table.long = room_table.long;
      model_table.sex_id = room_table.sex_id;

      await model_table.save();
      await this.#deleteRelatedImage(model_table.id);
      for (let i = 0; i < images.length; i++) {
        const element = images[i];

        await RoomImageModel.create(
          {
            parent_id: model_table.id,
            image: element.image,
          },
          { transaction: t }
        );
      }

      await t.commit();
      const modelx = await RoomModel.findOne({
        where: { id: model.id },
        include: [
          {
            model: RoomTableModel,
            as: "room_table",
            required: false,
            where: { id: req.params.id },
            include: [
              {
                model: RoomImageModel,
                as: "images",
                required: false,
              },
            ],
          },
        ],
      });
      this.#sendRoom(model_table.dataValues)

      res.send(modelx);
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };

  delete = async (req, res, next) => {
    const model = await RoomModel.findOne({ where: { id: req.params.id } });

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    try {
      await model.destroy({ force: true });
      await this.#deleteRelated(model.id);
    } catch (error) {
      await model.destroy();
      await this.#deleteRelated(model.id);
    }

    res.send(req.mf("data has been deleted"));
  };

  deleteTable = async (req, res, next) => {
    const model = await RoomTableModel.findOne({
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
    await this.#deleteRoomImage(model.image);
    res.send(req.mf("data has been deleted"));
  };

  #deleteRoomImage = (image) => {
    try {
      fs.unlinkSync("./uploads/room/" + image);
    } catch (error) {
      return 0;
    }
    return 1;
  };

  #deleteRelated = async (parent_id) => {
    let stepsModel = RoomTableModel.findAll({
      where: { parent_id: parent_id },
    });
    if (stepsModel) {
      await RoomTableModel.destroy(
        {
          where: { parent_id: parent_id },
          force: true,
        },
        { transaction: t }
      );

      for (let i = 0; i < stepsModel.length, i++;) {
        const element = stepsModel[i];
        await RoomImageModel.destroy(
          {
            where: { parent_id: element.id },
            force: true,
          },
          { transaction: t }
        );
        await this.#deleteRoomImage(element.image);
      }
    }
  };

  #deleteRelatedImage = async (parent_id) => {
    let stepsModel = RoomImageModel.findAll({
      where: { parent_id: parent_id },
    });
    if (stepsModel) {
      await RoomImageModel.destroy(
        {
          where: { parent_id: parent_id },
          force: true,
        },
        { transaction: t }
      );

      for (let i = 0; i < stepsModel.length, i++;) {
        const element = stepsModel[i];
        await this.#deleteRoomImage(element.image);
      }
    }
  };

  #sendRoom = async (model) => {
    let query = {};
    if (model.sex_id != 1) {
      query.sex_id = model.sex_id;
    }
    if (model.sex_id == 1) {
      query.sex_id = { [Op.in]: [2, 3] };
    }
    try {
      if (model.status == 'empty') {
        let client = await ClientModel.findAll({
          where: query,
          raw: true
        });

        for (let i = 0; i < client.length; i++) {
          const element = client[i];
          let currentTitle = "";
          if (element.lang == 'uz') {
            currentTitle = `Yangi kvatira.  ${(model.sex_id == 1 ? ' Hamma' : model.sex_id == 2 ? 'Erkaklar' : 'Ayollar') + ' uchun'} `
          } else if (element.lang == 'ru') {
            currentTitle = `Новая квартира. ${(model.sex_id == 1 ? ' Каждый' : model.sex_id == 2 ? 'Мужчины' : 'Женщины') + ' для'}`
          } else if (element.lang == 'ka') {
            currentTitle = `Квартираи нав. ${(model.sex_id == 1 ? ' Ҳама' : model.sex_id == 2 ? 'Мардон' : 'Духтарон') + ' барои'}`
          }

          var message = {
            to: element.fcm_token,
            notification: {
              title: currentTitle,
              body: model.id,
              type: "room"
            },
            data: {
              title: currentTitle,
              body: model.id,
              type: "room"
            },
          };
          await this.notification(message);
        }


      }
    } catch (err) {
      console.log(err)
    }
  }

  sendPostman = async (req, res, next) => {
    let model = req.body;
    let currentClient = req.currentClient;
    let message = {
      to: currentClient.fcm_token,
      data: {
        title: model.title,
        body: 2,
        type: "room",
      },
    };
    await this.notification(message);

    res.send(message)
  }
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ServicesController();
