const Joi = require('joi'); 

exports.addressSchemas = { 
  create: Joi.object({
    name_uz: Joi.string().required(),
    name_ru: Joi.string().required(),
    name_ka: Joi.string().required()
  }),
};