const Joi = require('joi');

exports.documentSchemas = {
  create: Joi.object({
    title_uz: Joi.string().required(),
    title_ru: Joi.string().required(),
    title_ka: Joi.string().required(),
    type: Joi.string().required(),
    file: Joi.string().allow("", null),
    url: Joi.string().allow("", null),
    image: Joi.string().allow("", null),
    status: Joi.boolean()
  }),
};