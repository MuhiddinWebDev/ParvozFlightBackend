const Joi = require('joi');

exports.clientSchemas = {
  create: Joi.object({
    // fullname: Joi.string().required().min(3).max(64),
    phone: Joi.string().required().min(3).max(16)
  }),
  checkPhone: Joi.object({
    // fullname: Joi.string().required().min(3).max(64),
    phone: Joi.string().required().min(3).max(16),
    fcm: Joi.string().allow(null, "")
  }),
  update: Joi.object({
    fullname: Joi.string().required().max(64),
    name: Joi.string().required().max(256),
    lang: Joi.string().max(2),
    phone: Joi.string().max(16).required(),
    age: Joi.number().allow(null),
    password: Joi.string().allow('', null),
    sex_id: Joi.number().allow(null),
    region_id: Joi.number().required(),
    address: Joi.string().allow('', null),
    client_table: Joi.array().items(
      Joi.object().keys({
        file: Joi.string().required().max(200)
      }).allow(null)
    )
  }),

  login: Joi.object({
    phone: Joi.string().required(),
    code: Joi.string().required().max(16),
    // fullname: Joi.string().required().min(3).max(64),
    // token: Joi.string().required().max(64),
    fcm_token: Joi.string().empty('').max(64)
  }),
  signIn: Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required()
  })
};