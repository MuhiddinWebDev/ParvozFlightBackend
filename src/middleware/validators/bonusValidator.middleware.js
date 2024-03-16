const Joi = require('joi');

exports.bonusSchemas = Joi.object({
  summa: Joi.number().required()
});