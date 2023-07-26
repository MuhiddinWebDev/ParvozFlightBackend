const Joi = require('joi'); 

exports.clientSchemas = { 
  create: Joi.object({
    // fullname: Joi.string().required().min(3).max(64),
    phone: Joi.string().required().min(3).max(16)
  }),

  update: Joi.object({
    fullname: Joi.string().required().min(3).max(64),
  }),

  login: Joi.object({
    phone: Joi.string().required(),
    code: Joi.string().required().max(16),
    // fullname: Joi.string().required().min(3).max(64),
    // token: Joi.string().required().max(64),
    fcm_token: Joi.string().empty('').max(64)
  }), 
};