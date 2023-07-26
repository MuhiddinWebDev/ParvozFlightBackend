const Joi = require('joi'); 

exports.agentSchemas = {
  create: Joi.object({
    phone: Joi.string().required().min(3).max(16),
    code: Joi.string().empty('').min(3).max(16),
    name: Joi.string().required().min(3).max(126),
    which_airline: Joi.string().required().min(3).max(256),
    password: Joi.string().min(3).required().label('Password'),
    confirmPassword: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
  }),

  update: Joi.object({
    phone: Joi.string().required().min(3).max(16),
    code: Joi.string().empty('').min(3).max(16),
    name: Joi.string().required().min(3).max(126),
    which_airline: Joi.string().required().min(3).max(256),
    password: Joi.string().min(3).label('Password').empty(''),
    confirmPassword: Joi.any().equal(Joi.ref('password')).empty('')
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
  }),

  login: Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
  }), 
}