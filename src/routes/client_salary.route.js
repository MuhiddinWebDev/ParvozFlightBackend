const express = require('express');
const router = express.Router();
const ClientSalaryController = require('../controllers/client_salary.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { clientSalarySchemas } = require('../middleware/validators/clientSalaryValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(ClientSalaryController.getAll));
router.get('/all', awaitHandlerFactory(ClientSalaryController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(ClientSalaryController.getById));
router.get('/one/id/:id', clientAuth(), awaitHandlerFactory(ClientSalaryController.getById));
router.post('/', auth(), joiMiddleware(clientSalarySchemas.model), awaitHandlerFactory(ClientSalaryController.create));
router.patch('/id/:id', auth(), joiMiddleware(clientSalarySchemas.model), awaitHandlerFactory(ClientSalaryController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(ClientSalaryController.delete));

module.exports = router;