const Joi = require('joi');

exports.clientResumeSchemas = {
  model: Joi.object({
    surname: Joi.string().required(),
    name: Joi.string().required(),
    sex_id: Joi.number().required(),
    phone: Joi.string().required().max(20),
    job_id: Joi.number().required(),
    job_type_id: Joi.number().required(),
    address_id: Joi.number().required(),
    salary: Joi.number().required(),
    work_time: Joi.string().required().max(10),
    work_time: Joi.string().allow(null, ""),
    status: Joi.boolean().required()
  }),
};