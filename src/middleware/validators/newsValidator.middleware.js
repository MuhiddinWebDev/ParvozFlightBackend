const Joi = require('joi');

exports.newSchemas = {
  create: Joi.object({
    text_uz: Joi.string().required(),
    text_ru: Joi.string().required(),
    text_ka: Joi.string().required(),
    datetime: Joi.number().required(),
    image: Joi.string().allow("", null),
    video: Joi.string().allow("", null),
    type: Joi.string().required(),
    status: Joi.boolean()
  }),
};