const Joi = require('joi'); 

exports.serviceCategorySchemas = Joi.object({
  k_name_uz: Joi.string().max(256).required(),
  k_name_ru: Joi.string().max(256).required(),
  k_name_ka: Joi.string().max(256).required(),
  k_image: Joi.string().max(64).empty(''),
  change_image: Joi.string()
});