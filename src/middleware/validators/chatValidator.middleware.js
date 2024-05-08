const Joi = require('joi'); 

exports.chatSchemas = Joi.object({
  // datetime: Joi.number().integer().custom(
  //   v => { return new Date(v).getTime(); })
  //   .required(),
  text: Joi.string().empty(),
  order_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().required(),
  voice: Joi.string().empty(''),
  file: Joi.string().empty(''),
  image: Joi.string().empty('')
  // view: Joi.string().empty('')
})