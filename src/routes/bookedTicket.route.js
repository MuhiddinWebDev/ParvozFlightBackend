const express = require('express');
const router = express.Router();
const bookedTicketController = require('../controllers/bookedTicket.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { bookedTicketSchemas } = require('../middleware/validators/bookedTicketValidator.middleware');


router.get('/all', clientAuth(), awaitHandlerFactory(bookedTicketController.getAll));
router.get('/', auth(), awaitHandlerFactory(bookedTicketController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(bookedTicketController.getById));
router.post('/', auth(), joiMiddleware(bookedTicketSchemas.create), awaitHandlerFactory(bookedTicketController.create));
router.post('/create', clientAuth(), joiMiddleware(bookedTicketSchemas.create), awaitHandlerFactory(bookedTicketController.create));
router.patch('/id/:id', auth(), joiMiddleware(bookedTicketSchemas.update), awaitHandlerFactory(bookedTicketController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(bookedTicketController.delete));

module.exports = router;