const Joi = require('joi'); 

exports.clientSchemas = { 
  create: Joi.object({
    // fullname: Joi.string().required().min(3).max(64),
    phone: Joi.string().required().min(3).max(16)
  }),
  checkPhone: Joi.object({
    // fullname: Joi.string().required().min(3).max(64),
    phone: Joi.string().required().min(3).max(16),
    fcm:Joi.string().allow(null, "")
  }),
  update: Joi.object({
    fullname: Joi.string().required().min(3).max(64),
    lang: Joi.string().max(2),
    phone: Joi.string().max(16).required(),
    age: Joi.number().allow(null),
    password:Joi.string().allow('',null),
    sex_id: Joi.number().allow(null),
    passport: Joi.string().allow('',null)
  }),

  login: Joi.object({
    phone: Joi.string().required(),
    code: Joi.string().required().max(16),
    // fullname: Joi.string().required().min(3).max(64),
    // token: Joi.string().required().max(64),
    fcm_token: Joi.string().empty('').max(64)
  }), 
};