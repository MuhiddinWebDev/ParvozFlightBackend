const Joi = require('joi'); 

exports.transportSchemas = { 
  create: Joi.object({
    name_uz: Joi.string().required(),
    name_ru: Joi.string().required(),
    name_ka: Joi.string().required(),
    icon: Joi.string().empty(''),
    link: Joi.string().empty('')
  }),
};