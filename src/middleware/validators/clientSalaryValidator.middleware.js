const Joi = require('joi'); 

exports.clientSalarySchemas = { 
  model: Joi.object({
    name_uz: Joi.string().required(),
    name_ru: Joi.string().required(),
    name_ka: Joi.string().required()
  }),
};