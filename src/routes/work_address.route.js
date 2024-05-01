const express = require('express');
const router = express.Router();
const addressController = require('../controllers/work_address.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { addressSchemas } = require('../middleware/validators/workAddressValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(addressController.getAll));
router.get('/all', awaitHandlerFactory(addressController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(addressController.getById));
router.get('/one/id/:id', clientAuth(), awaitHandlerFactory(addressController.getById));
router.post('/', auth(), joiMiddleware(addressSchemas.create), awaitHandlerFactory(addressController.create));
router.patch('/id/:id', auth(), joiMiddleware(addressSchemas.create), awaitHandlerFactory(addressController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(addressController.delete));

module.exports = router;