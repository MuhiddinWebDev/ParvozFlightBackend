const Joi = require('joi'); 

exports.linksSchemas = { 
  model: Joi.object({
    android: Joi.string().required(),
    ios: Joi.string().required(),

  }),
};