const Joi = require('joi'); 

exports.orderSchemas = { 
  byClient: Joi.object({
    passport: Joi.string().required(),
    migrant_carta: Joi.string().required(),
    phone: Joi.string().required()
  }),
  byAdmin: Joi.object({
    status: Joi.string().required(),
    region_id: Joi.number().required(),
    passport: Joi.string().required(),
    migrant_carta: Joi.string().required(),
    phone: Joi.string().required(),
  })
};