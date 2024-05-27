const Joi = require('joi'); 

exports.promocodeSchemas = { 
  create: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().allow(''),
    promocode: Joi.string().required()
  }),
};