const Joi = require('joi');

exports.newSchemas = {
  create: Joi.object({
    text_uz: Joi.string().required(),
    text_ru: Joi.string().required(),
    text_ka: Joi.string().required(),
    network: Joi.string().required(),
    image: Joi.string().allow("", null),
    status: Joi.boolean()
  }),
};