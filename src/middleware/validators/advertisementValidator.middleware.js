const Joi = require('joi');

exports.advertisementSchemas = {
  create: Joi.object({
    title_uz: Joi.string().required(),
    title_ru: Joi.string().required(),
    title_ka: Joi.string().required(),
    image: Joi.string().allow("", null),
    text_uz: Joi.string().allow("", null),
    text_ru: Joi.string().allow("", null),
    text_ka: Joi.string().allow("", null),
    status: Joi.boolean()
  }),
};