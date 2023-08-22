const Joi = require('joi'); 


exports.roomSchemas = { 


  room: Joi.object({
    name_uz: Joi.string().max(128).required(),
    name_ru: Joi.string().max(128).required(),
    name_ka: Joi.string().max(128).required()
  }),


  roomTable: Joi.object({
    parent_id: Joi.number().required(),
    address_id: Joi.number().required(),
    price: Joi.number().required(),
    phone_number: Joi.string().max(16).required(),
    comment_uz: Joi.string().allow(null, ''),
    comment_ru: Joi.string().allow(null, ''),
    comment_ka: Joi.string().allow(null, ''),
    area: Joi.string().max(64).empty(''),
    status: Joi.string().valid('empty', 'busy').required(),
    images: Joi.array().items(
        Joi.object().keys({
          image: Joi.string().max(256).required()
        })
    ).allow('', null).required(),
    long: Joi.number().precision(2).empty(''),
    lat: Joi.number().precision(2).empty('')    
  }),


};