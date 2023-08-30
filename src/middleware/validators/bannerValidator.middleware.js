const Joi = require('joi'); 

exports.bannerSchemas = Joi.object({
  image: Joi.string().required().max(128),
  url: Joi.string().empty('').max(256),
  description_uz: Joi.string().empty(''),
  description_ru: Joi.string().empty(''),
  description_ka: Joi.string().empty(''),
  change_image: Joi.string().empty('')
  });