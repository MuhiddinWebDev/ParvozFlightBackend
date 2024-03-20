const Joi = require('joi');

exports.menuTableSchema = {
  model: Joi.object({
    title: Joi.string().required(),
    icon: Joi.string().required(),
    name: Joi.string().required(),
    status: Joi.boolean().required(),
  }),
};