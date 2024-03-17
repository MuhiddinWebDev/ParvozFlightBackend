const Joi = require('joi');
const Role = require('../../utils/userRoles.utils');

exports.userSchemas = {
  create: Joi.object({
    username: Joi.string().required().min(3).max(25),
    phone: Joi.string().required().min(7).max(20),
    fullname: Joi.string().required().min(3).max(50),
    role: Joi.string().valid(Role.Admin, Role.User, Role.Programmer).required(),
    password: Joi.string().min(3).required().label('Password'),
    all_page: Joi.boolean().required(),
    user_table: Joi.array().items(
      Joi.object().keys({
        title: Joi.string().required(),
        name: Joi.string().required(),
        icon: Joi.string().required(),
        status: Joi.boolean().required()
      })
    )

  }),

  update: Joi.object({
    username: Joi.string().required().min(3).max(25),
    phone: Joi.string().required().min(7).max(20),
    fullname: Joi.string().required().min(3).max(50),
    role: Joi.string().valid(Role.Admin, Role.User, Role.Programmer).required(),
    password: Joi.string().min(3).label('Password').empty(''),
    all_page: Joi.boolean().required(),
    user_table: Joi.array().items(
      Joi.object().keys({
        title: Joi.string().required(),
        name: Joi.string().required(),
        icon: Joi.string().required(),
        status: Joi.boolean().required()
      })
    )
  }),

  login: Joi.object({
    username: Joi.string().empty(''),
    password: Joi.string().required(),
  }),
};