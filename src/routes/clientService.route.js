const express = require('express');
const router = express.Router();
const clientServiceController = require('../controllers/clientService.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { clientServiceSchemas } = require('../middleware/validators/clientServiceValidator.middleware');

router.get('/all', auth(), awaitHandlerFactory(clientServiceController.getAllWeb));
router.get('/', awaitHandlerFactory(clientServiceController.getAllMobile));
router.get('/id/:id', auth(), awaitHandlerFactory(clientServiceController.getById));
router.post('/', auth(), joiMiddleware(clientServiceSchemas.create), awaitHandlerFactory(clientServiceController.create));
router.patch('/id/:id', auth(), joiMiddleware(clientServiceSchemas.create), awaitHandlerFactory(clientServiceController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(clientServiceController.delete));

module.exports = router;