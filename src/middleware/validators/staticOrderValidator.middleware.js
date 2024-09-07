const Joi = require('joi'); 

exports.orderSchemas = { 
  byClient: Joi.object({
    passport: Joi.string().required().allow(null),
    migrant_carta: Joi.string().required().allow(null),
    phone: Joi.string().required().allow(null)
  }),
  byAdmin: Joi.object({
    status: Joi.string().required(),
    region_id: Joi.number().required(),
    passport: Joi.string().required().allow(null),
    migrant_carta: Joi.string().required().allow(null),
    phone: Joi.string().required().allow(null),
  })
};