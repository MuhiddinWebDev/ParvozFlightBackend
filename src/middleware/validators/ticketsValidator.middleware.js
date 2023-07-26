const Joi = require('joi'); 

exports.ticketsSchemas = { 
  
  
  createAdmin: Joi.object({
    client_id: Joi.number().empty(''),
    // parent_id: Joi.number().empty(''),
    transport_id: Joi.number().required(),
    from_id: Joi.number().required(),
    to_id: Joi.number().required(),
    price: Joi.number().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    image: Joi.string().required(),
    company_name: Joi.string().required(),
    rushnoy: Joi.string().required(),
    baggage: Joi.boolean().required(),
    comment: Joi.string().empty(''),
    currency: Joi.string().valid('USD','RUB','UZS').required()
  }),
  
  
  createAgent: Joi.object({
    transport_id: Joi.number().empty(''),
    from_id: Joi.number().required(),
    to_id: Joi.number().required(),
    price: Joi.number().required(),
    date: Joi.string().empty(''),
    end_date: Joi.string().empty(''),
    image: Joi.string().empty(''),
    company_name: Joi.string().empty(''),
    rushnoy: Joi.string().empty(''),
    baggage: Joi.boolean().required(),
    comment: Joi.string().empty(''),
    currency: Joi.string().valid('USD','RUB','UZS').required()
  }),
  
  
  update: Joi.object({
    client_id: Joi.number().empty(''),
    transport_id: Joi.number().required(),
    from_id: Joi.number().required(),
    to_id: Joi.number().required(),
    price: Joi.number().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    image: Joi.string().required(),
    company_name: Joi.string().required(),
    rushnoy: Joi.string().required(),
    baggage: Joi.boolean().required(),
    comment: Joi.string().empty(''),
    status: Joi.string().valid('waiting', 'rejected', 'done').required(),
    currency: Joi.string().valid('USD','RUB','UZS').required()
  }),


  statusUpdate: Joi.object({
    status: Joi.string().valid('waiting', 'rejected', 'done').required()
  })
};