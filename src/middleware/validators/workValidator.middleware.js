const Joi = require('joi');

exports.workSchemas = {

  create: Joi.object({
    work_id: Joi.number().required(),
    work_table: Joi.array().items(
      Joi.object().keys({
        image: Joi.string().allow(null, '').max(128),
        title_uz: Joi.string().required().max(256),
        title_ru: Joi.string().required().max(256),
        title_ka: Joi.string().required().max(256),
        comment_uz: Joi.string().allow('', null),
        comment_ru: Joi.string().allow('', null),
        comment_ka: Joi.string().allow('', null),
        phone: Joi.string().required(),
        from_price: Joi.number().empty(''),
        to_price: Joi.number().empty(''),
        change_image: Joi.string(),
        price_type_uz: Joi.string().required().max(32),
        price_type_ru: Joi.string().required().max(32),
        price_type_ka: Joi.string().required().max(32),
        create_at: Joi.string().required().max(16),
        long: Joi.number().precision(2).empty(''),
        lat: Joi.number().precision(2).empty(''),
        address_id: Joi.number().required(),
        sex_id: Joi.number(),
        end_date: Joi.number().allow(null, ""),
        start_age: Joi.number().allow(null),
        end_age: Joi.number().allow(null),
      })
    ).required()
  }),


  createAdmin: Joi.object({
    work_id: Joi.number().required(),
    work_table: Joi.array().items(
      Joi.object().keys({
        image: Joi.string().allow(null, '').max(128),
        title_uz: Joi.string().required().max(256),
        title_ru: Joi.string().required().max(256),
        title_ka: Joi.string().required().max(256),
        comment_uz: Joi.string().allow('', null),
        comment_ru: Joi.string().allow('', null),
        comment_ka: Joi.string().allow('', null),
        phone: Joi.string().required(),
        from_price: Joi.number().empty(''),
        to_price: Joi.number().empty(''),
        change_image: Joi.string(),
        price_type_uz: Joi.string().required().max(32),
        price_type_ru: Joi.string().required().max(32),
        price_type_ka: Joi.string().required().max(32),
        create_at: Joi.string().required().max(16),
        long: Joi.number().precision(2).empty(''),
        lat: Joi.number().precision(2).empty(''),
        status: Joi.string().valid('new', 'active', 'rejected').required(),
        address_id: Joi.number().required(),
        sex_id: Joi.number().required(),
        end_date: Joi.number().allow(null, ""),
        start_age: Joi.number().allow(null),
        end_age: Joi.number().allow(null),
      })
    ).required()
  }),


  createCategory: Joi.object({
    title_uz: Joi.string().max(256).required(),
    title_ru: Joi.string().max(256).required(),
    title_ka: Joi.string().max(256).required()
  }),


  update: Joi.object({
    work_table: Joi.array().items(
      Joi.object().keys({
        image: Joi.string().empty('').max(128),
        title_uz: Joi.string().required().max(256),
        title_ru: Joi.string().required().max(256),
        title_ka: Joi.string().required().max(256),
        comment_uz: Joi.string().allow('', null),
        comment_ru: Joi.string().allow('', null),
        comment_ka: Joi.string().allow('', null),
        phone: Joi.string().required(),
        from_price: Joi.number().empty(''),
        to_price: Joi.number().empty(''),
        change_image: Joi.string(),
        price_type_uz: Joi.string().required().max(32),
        price_type_ru: Joi.string().required().max(32),
        price_type_ka: Joi.string().required().max(32),
        create_at: Joi.string().required().max(16),
        long: Joi.number().precision(2).empty(''),
        lat: Joi.number().precision(2).empty(''),
        status: Joi.string().valid('new', 'active', 'rejected').required(),
        address_id: Joi.number().required(),
        sex_id: Joi.number().required(),
        end_date: Joi.number().allow(null, ""),
        start_age: Joi.number().allow(null),
        end_age: Joi.number().allow(null),
      })
    ).required()
  }),


  updateProduct: Joi.object({
    parent_id: Joi.number().required(),
    image: Joi.string().empty('').max(128),
    title_uz: Joi.string().required().max(256),
    title_ru: Joi.string().required().max(256),
    title_ka: Joi.string().required().max(256),
    comment_uz: Joi.string().allow('', null),
    comment_ru: Joi.string().allow('', null),
    comment_ka: Joi.string().allow('', null),
    phone: Joi.string().required(),
    from_price: Joi.number().empty(''),
    to_price: Joi.number().empty(''),
    change_image: Joi.string(),
    price_type_uz: Joi.string().required().max(32),
    price_type_ru: Joi.string().required().max(32),
    price_type_ka: Joi.string().required().max(32),
    create_at: Joi.string().required().max(16),
    long: Joi.number().precision(2).empty(''),
    lat: Joi.number().precision(2).empty(''),
    status: Joi.string().valid('new', 'active', 'rejected').required(),
    address_id: Joi.number().required(),
    sex_id: Joi.number().required(),
    start_age: Joi.number().allow(null),
    end_date: Joi.number().allow(null, ""),
    end_age: Joi.number().allow(null),
  }),


  createProduct: Joi.object({
    image: Joi.string().empty('').max(128),
    title_uz: Joi.string().required().max(256),
    title_ru: Joi.string().required().max(256),
    title_ka: Joi.string().required().max(256),
    comment_uz: Joi.string().allow(null, ""),
    comment_ru: Joi.string().allow(null, ""),
    comment_ka: Joi.string().allow(null, ""),
    phone: Joi.string().required(),
    from_price: Joi.number().empty(''),
    to_price: Joi.number().empty(''),
    change_image: Joi.string(),
    price_type_uz: Joi.string().required().max(32),
    price_type_ru: Joi.string().required().max(32),
    price_type_ka: Joi.string().required().max(32),
    create_at: Joi.string().required().max(16),
    long: Joi.number().precision(2).empty(''),
    lat: Joi.number().precision(2).empty(''),
    address_id: Joi.number().required(),
    parent_id: Joi.number(),
    sex_id: Joi.number().allow(null),
    start_age: Joi.number().allow(null),
    end_date: Joi.string(),
    end_age: Joi.number().allow(null),
  }),
};