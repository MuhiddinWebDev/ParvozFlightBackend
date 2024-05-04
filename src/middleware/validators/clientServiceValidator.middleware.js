const Joi = require('joi');

exports.clientServiceSchemas = {
  create: Joi.object({
    title_uz: Joi.string().required(),
    title_ru: Joi.string().required(),
    title_ka: Joi.string().required(),
    summa: Joi.number().required(),
    required: Joi.required(),
    status: Joi.boolean()
  }),
  order: Joi.object({
    client_service: Joi.array().required(),
    total_sum: Joi.number().required()
  })
};