const express = require('express');
const router = express.Router();
const addressBiletController = require('../controllers/addressBilet.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const agentAuth = require('../middleware/agentAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { addressSchemas } = require('../middleware/validators/addressValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(addressBiletController.getAll));
router.get('/all', clientAuth(), awaitHandlerFactory(addressBiletController.getAll));
router.get('/all-address', agentAuth(), awaitHandlerFactory(addressBiletController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(addressBiletController.getById));
router.get('/one/id/:id', clientAuth(), awaitHandlerFactory(addressBiletController.getById));
router.post('/', auth(), joiMiddleware(addressSchemas.create), awaitHandlerFactory(addressBiletController.create));
router.patch('/id/:id', auth(), joiMiddleware(addressSchemas.create), awaitHandlerFactory(addressBiletController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(addressBiletController.delete));

module.exports = router;