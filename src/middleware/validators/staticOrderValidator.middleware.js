const Joi = require('joi'); 

exports.orderSchemas = { 
  byClient: Joi.object({
    passport: Joi.string().required(),
    migrant_carta: Joi.string().required(),
    phone: Joi.string().required()
  }),
  byAdmin: Joi.object({
    passport: Joi.string().required(),
    migrant_carta: Joi.string().required(),
    phone: Joi.string().required(),
    status: Joi.string().required()
  })
};