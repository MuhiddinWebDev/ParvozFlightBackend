const Joi = require('joi');

exports.servicesSchemas = Joi.object({
  category_id: Joi.number().required(),
  name_uz: Joi.string().max(256).required(),
  name_ru: Joi.string().max(256).required(),
  name_ka: Joi.string().max(256).required(),
  average_date_uz: Joi.string().max(8).required(),
  average_date_ru: Joi.string().max(8).required(),
  average_date_ka: Joi.string().max(8).required(),
  icon: Joi.string().required().max(128),
  comment_uz: Joi.string().empty(''),
  comment_ru: Joi.string().empty(''),
  comment_ka: Joi.string().empty(''),
  change_icon: Joi.string(),
  summa: Joi.number().required(),
  discount_summa: Joi.number().empty(''),
  services_steps_table: Joi.array().items(
      Joi.object().keys({
        title_uz: Joi.string().max(256).required(),
        title_ru: Joi.string().max(256).required(),
        title_ka: Joi.string().max(256).required(),
        comment_uz: Joi.string().empty(''),
        comment_ru: Joi.string().empty(''),
        comment_ka: Joi.string().empty(''),
        // status: Joi.string().valid('waiting', 'active', 'done').required(),
        action: Joi.boolean().required(),
        promocode: Joi.string().max(256).empty(''),
        // check_promocode: Joi.boolean().required(),
        active_promocode: Joi.boolean().empty(''),
        action_title_uz: Joi.string().max(256).empty(''),
        action_title_ru: Joi.string().max(256).empty(''),
        action_title_ka: Joi.string().max(256).empty(''),
        // active: Joi.boolean().required(),
        steps_fields_table: Joi.array().items(
            Joi.object().keys({
              title_uz: Joi.string().max(256).required(),
              title_ru: Joi.string().max(256).required(),
              title_ka: Joi.string().max(256).required(),
              type: Joi.string().valid('image', 'file', 'number','text','date').required()
            })
        ).required(),
      })
  ).required()
})