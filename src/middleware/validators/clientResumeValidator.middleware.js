const Joi = require('joi'); 

exports.clientResumeSchemas = { 
  model: Joi.object({
    surname: Joi.string().required(),
    name: Joi.string().required(),
    sex_id: Joi.number().required(),
    phone: Joi.string().required().max(20),
    work_type_id: Joi.number().required(),
    job: Joi.string().required(),
    address_id: Joi.number().required(),
    salary_id: Joi.number().required(),
    work_time: Joi.string().required().max(10),
  }),
};