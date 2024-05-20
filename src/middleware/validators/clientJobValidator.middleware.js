const Joi = require('joi'); 

exports.clientJobSchema = { 
  job: Joi.object({
    name_uz: Joi.string().required(),
    name_ru: Joi.string().required(),
    name_ka: Joi.string().required()
  }),
  jobChild: Joi.object({
    name_uz: Joi.string().required(),
    name_ru: Joi.string().required(),
    name_ka: Joi.string().required(),
    parent_id: Joi.number().required()
  })
};