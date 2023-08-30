const Joi = require('joi'); 

exports.bookedTicketSchemas ={ 
    create: Joi.object({
      from_where_id: Joi.number().integer().required(),
      to_where_id: Joi.number().integer().required(),
      date_flight: Joi.string().required(),
      baggage: Joi.boolean().required()
    }),


    update: Joi.object({
      from_where_id: Joi.number().integer().required(),
      to_where_id: Joi.number().integer().required(),
      // date_flight: Joi.string().required(),
      baggage: Joi.boolean().required(),
      status: Joi.string().valid('New', 'View', 'Done', 'Canceled').required(),
      client_id: Joi.number().integer().required()
    })
};