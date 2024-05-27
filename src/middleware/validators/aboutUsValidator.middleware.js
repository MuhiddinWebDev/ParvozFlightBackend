const Joi = require('joi'); 

exports.aboutUsSchemas = { 
  model: Joi.object({
    telegram: Joi.string().required(),
    instagram: Joi.string().required(),
    facebook: Joi.string().required(),
    phone: Joi.string().required(),
  }),
};