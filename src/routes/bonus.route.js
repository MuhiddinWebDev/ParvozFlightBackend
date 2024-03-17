const express = require('express');
const router = express.Router();
const bonusController = require('../controllers/bonus.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { bonusSchemas } = require('../middleware/validators/bonusValidator.middleware');


router.get('/all', auth(), awaitHandlerFactory(bonusController.getAll));
router.get('/one', auth(), awaitHandlerFactory(bonusController.getById));
router.post('/', auth(), joiMiddleware(bonusSchemas), awaitHandlerFactory(bonusController.create));
router.patch('/id/:id', auth(), joiMiddleware(bonusSchemas), awaitHandlerFactory(bonusController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(bonusController.delete));

module.exports = router;