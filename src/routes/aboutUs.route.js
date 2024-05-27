const express = require('express');
const router = express.Router();
const aboutUsController = require('../controllers/aboutUs.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { aboutUsSchemas } = require('../middleware/validators/aboutUsValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(aboutUsController.getAll));
router.get('/one', awaitHandlerFactory(aboutUsController.getForMobile));
router.get('/id/:id', auth(), awaitHandlerFactory(aboutUsController.getById));
router.post('/', auth(), joiMiddleware(aboutUsSchemas.model), awaitHandlerFactory(aboutUsController.create));
router.patch('/id/:id', auth(), joiMiddleware(aboutUsSchemas.model), awaitHandlerFactory(aboutUsController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(aboutUsController.delete));

module.exports = router;