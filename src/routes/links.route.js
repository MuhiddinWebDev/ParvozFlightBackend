const express = require('express');
const router = express.Router();
const linksController = require('../controllers/links.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { linksSchemas } = require('../middleware/validators/linksValidator.middleware');


router.get('/', awaitHandlerFactory(linksController.getAll));
router.get('/last', awaitHandlerFactory(linksController.getLast));
router.get('/id/:id', awaitHandlerFactory(linksController.getById));
router.post('/', auth(), joiMiddleware(linksSchemas.model), awaitHandlerFactory(linksController.create));
router.patch('/id/:id', auth(), joiMiddleware(linksSchemas.model), awaitHandlerFactory(linksController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(linksController.delete));

module.exports = router;