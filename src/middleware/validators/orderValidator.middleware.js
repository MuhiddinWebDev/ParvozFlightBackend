const Joi = require('joi');


exports.orderSchemas = { 
  sendFieldsMobil: Joi.object({
    request_id: Joi.number().integer().required(),
    promocode: Joi.string().max(256).empty(''),
    step_id: Joi.number().integer().required(),
    fields: Joi.array().items(
        Joi.object().keys({
          id: Joi.number().integer().required(),
          value: Joi.string().max(256).required(),
        })
    ).required()
  }),


  create: Joi.object({
    service_id: Joi.number().integer().required(),
    order_steps_table: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().max(256).required(),
          comment: Joi.string().max(256).empty(''),
          status: Joi.string().valid('waiting', 'active', 'done').required(),
          action: Joi.string().valid('true', 'false').required(),
          action_title: Joi.string().max(256).required(),
          order_steps_fields_table: Joi.array().items(
              Joi.object().keys({
                title: Joi.string().max(256).required(),
                type: Joi.string().valid('image', 'file', 'number','text','date','promocode').required(),
                value: Joi.string().max(256).required(),
              })
          ).required(),
        })
    ).required()
  }),
};