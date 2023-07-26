const Joi = require('joi'); 

exports.reviewsSchemas = Joi.object({
  image: Joi.string().empty('').max(128),
  name_uz: Joi.string().required().max(256),
  name_ru: Joi.string().required().max(256),
  name_ka: Joi.string().required().max(256),
  comment_uz: Joi.string().empty(''),
  comment_ru: Joi.string().empty(''),
  comment_ka: Joi.string().empty(''),
  rating: Joi.number().required(),
  change_image: Joi.string() 
  });