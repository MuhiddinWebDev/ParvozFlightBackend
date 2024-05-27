const express = require('express');
const router = express.Router();
const promocodeController = require('../controllers/promocode.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { promocodeSchemas } = require('../middleware/validators/promocodeValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(promocodeController.getAll));
router.post('/auto', auth(), awaitHandlerFactory(promocodeController.autoCode));
router.get('/id/:id', auth(), awaitHandlerFactory(promocodeController.getById));
router.post('/', auth(), joiMiddleware(promocodeSchemas.create), awaitHandlerFactory(promocodeController.create));
router.patch('/id/:id', auth(), joiMiddleware(promocodeSchemas.create), awaitHandlerFactory(promocodeController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(promocodeController.delete));

module.exports = router;