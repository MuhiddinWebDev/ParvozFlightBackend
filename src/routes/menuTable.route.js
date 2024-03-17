const express = require('express');
const router = express.Router();
const menuTableController = require('../controllers/menuTable.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { menuTableSchema } = require('../middleware/validators/menuTableValidator.middleware');


router.get('/all', auth(), awaitHandlerFactory(menuTableController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(menuTableController.getById));
router.post('/', auth(), joiMiddleware(menuTableSchema.model), awaitHandlerFactory(menuTableController.create));
router.patch('/id/:id', auth(), joiMiddleware(menuTableSchema.model), awaitHandlerFactory(menuTableController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(menuTableController.delete));

module.exports = router;