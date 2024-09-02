const express = require('express');
const router = express.Router();
const aboutUsController = require('../controllers/links.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { linksSchemas } = require('../middleware/validators/linksValidator.middleware');


router.get('/', awaitHandlerFactory(aboutUsController.getAll));
router.get('/id/:id', awaitHandlerFactory(aboutUsController.getById));
router.post('/', auth(), joiMiddleware(linksSchemas.model), awaitHandlerFactory(aboutUsController.create));
router.patch('/id/:id', auth(), joiMiddleware(linksSchemas.model), awaitHandlerFactory(aboutUsController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(aboutUsController.delete));

module.exports = router;