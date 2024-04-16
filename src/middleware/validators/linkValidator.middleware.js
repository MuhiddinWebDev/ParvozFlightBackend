const Joi = require('joi');

exports.linkSchemas = {
  create: Joi.object({
    title_uz: Joi.string().required(),
    title_ru: Joi.string().required(),
    title_ka: Joi.string().required(),
    image: Joi.string().allow("", null),
    url: Joi.string().required(),
    status: Joi.boolean()
  }),
};