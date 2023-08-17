const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { clientSchemas } = require('../middleware/validators/clientValidator.middleware');


router.get('/',  auth(Role.Admin), awaitHandlerFactory(clientController.getAll));
router.get('/id/:id',  auth(Role.Admin), awaitHandlerFactory(clientController.getById));
router.get('/phone/:phone', auth(), awaitHandlerFactory(clientController.getByPhoneNumber));
router.post('/phone', joiMiddleware(clientSchemas.checkPhone), awaitHandlerFactory(clientController.checkPhone));
router.get('/get-client', clientAuth(), awaitHandlerFactory(clientController.getClient));
router.post('/', auth(Role.Admin), joiMiddleware(clientSchemas.create), awaitHandlerFactory(clientController.create));
router.patch('/id/:id', clientAuth(), joiMiddleware(clientSchemas.update), awaitHandlerFactory(clientController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(clientController.delete));

router.post('/login', joiMiddleware(clientSchemas.login), awaitHandlerFactory(clientController.clientLogin));

module.exports = router;