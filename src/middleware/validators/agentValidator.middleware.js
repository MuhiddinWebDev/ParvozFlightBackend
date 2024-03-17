const Joi = require('joi'); 

exports.agentSchemas = {
  create: Joi.object({
    phone: Joi.string().required().min(3).max(16),
    code: Joi.string().empty('').min(3).max(16),
    name: Joi.string().required().min(3).max(126),
    which_airline: Joi.string().required().min(3).max(256),
    password: Joi.string().min(3).required().label('Password'),
   
  }),

  update: Joi.object({
    phone: Joi.string().required().min(3).max(16),
    code: Joi.string().empty('').min(3).max(16),
    name: Joi.string().required().min(3).max(126),
    which_airline: Joi.string().required().min(3).max(256),
    password: Joi.string().min(3).label('Password').empty(''),
  }),

  login: Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
  }), 
}