const WorkModel = require("../models/work.model");
const WorkTableModel = require("../models/workTable.model");
const AddressModel = require("../models/address.model");
const HttpException = require("../utils/HttpException.utils");
const BaseController = require("./BaseController");
const sequelize = require("../db/db-sequelize");
const { Op } = require("sequelize");
const moment = require("moment");
const fs = require("fs");
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
    query.status = "active";

    if (body.address_id) {
      query.address_id = body.address_id;
    }

    if (body.parent_id) {
      query.parent_id = body.parent_id;
    }

    // const work = await WorkModel.findOne({
    //     attributes: [
    //         'id',
    //         [ sequelize.literal(`WorkModel.title_${lang}`), 'title' ]
    //     ],
    //     where: { id: req.params.id },
    //     include: [
    //         {
    //             model: WorkTableModel,
    //             attributes: [
    //                 'id', 'image','parent_id', 'from_price', 'to_price', 'phone','lat','long',
    //                 [ sequelize.literal(`work_table.title_${lang}`), 'title' ],
    //                 [ sequelize.literal(`work_table.comment_${lang}`), 'comment' ],
    //             ],
    //             as: 'work_table',
    //             where: query,
    //             required: false,
    //             include: [
    //                 {
    //                     model: AddressModel,
    //                     attributes: [
    //                         [ sequelize.literal(`\`work_table->address\`.name_${lang}`), 'name' ]
    //                     ],
    //                     as: 'address',
    //                     required: false
    //                 }
    //             ],
    //         }
    //     ],
    // });

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
        [sequelize.literal(`title_${lang}`), "title"],
        [sequelize.literal(`price_type_${lang}`), "price_type"],
        [sequelize.literal(`comment_${lang}`), "comment"],
      ],
      include: [
        {
          model: AddressModel,
          attributes: ["id", [sequelize.literal(`name_${lang}`), "name"]],
          as: "address",
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
    for (let i = 0; i < work.length; i++) {
      let element = work[i];
      let workParent = await WorkModel.findOne({
        attributes: ["id", [sequelize.literal(`title_${lang}`), "title"]],
        where: { id: element.parent_id },
      });
      console.log();
      if (workParent) {
        element.dataValues.work_type = {
          id: workParent.dataValues.id,
          name: workParent.dataValues.title,
        };
      }
    }

    res.send(work);
  };

  getAllProduct = async (req, res, next) => {
    let lang = req.get("Accept-Language");
    lang = lang ? lang : "uz";

    const work_table = await WorkTableModel.findAll({
      where: { status: "active" },
      attributes: [
        "id",
        "image",
        "from_price",
        "to_price",
        "phone",
        "lat",
        "long",
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
      order: [["id", "DESC"]],
    });

    if (!work_table) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(work_table);
  };

  getAllWebProduct = async (req, res, next) => {
    let sql = `
        SELECT 
            w.id AS cat_id, w.title_uz AS cat_name,
            wt.id, wt.parent_id, 
            wt.title_uz AS title, 
            wt.from_price, wt.to_price, wt.phone, 
            wt.comment_uz AS comment, 
            wt.image, wt.status, 
            wt.price_type_uz AS price_type,
            wt.create_at, wt.address_id,
            wt.lat, wt.long
        FROM work_table wt 
        LEFT JOIN works w ON w.id = wt.parent_id
        ORDER BY wt.createdAt DESC`;
    let result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    if (!result) {
      throw new HttpException(404, req.mf("data not found"));
    }

    res.send(result);
  };

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
            wt.lat, wt.long
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
    console.log('TESTTTTT____________________________')
    let { work_table, work_id } = req.body;

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
            end_date: element.end_date,
            start_age: element.start_age,
            end_age: element.end_age,
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
          end_date: work_table.end_date,
          start_age: work_table.start_age,
          end_age: work_table.end_age,
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
            from_price: element.from_price,
            to_price: element.to_price,
            phone: element.phone,
            address_id: element.address_id,
            sex_id: element.sex_id,
            end_date: element.end_date,
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

    if (!model) {
      throw new HttpException(404, req.mf("data not found"));
    }

    let t = await sequelize.transaction();
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
      model.end_date = work_table.end_date;
      model.start_age = work_table.start_age;
      model.end_age = work_table.end_age;

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

  #deleteBannerimg = (icon) => {
    try {
      fs.unlinkSync("./uploads/icon/" + icon);
    } catch (error) {
      return 0;
    }
    return 1;
  };

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
