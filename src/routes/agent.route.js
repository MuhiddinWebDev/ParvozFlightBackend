const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { agentSchemas } = require('../middleware/validators/agentValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(agentController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(agentController.getById));
router.post('/code', auth(), awaitHandlerFactory(agentController.checkCode));
router.post('/check-code', clientAuth(), awaitHandlerFactory(agentController.checkCode));
router.post('/', auth(), joiMiddleware(agentSchemas.create), awaitHandlerFactory(agentController.create));
router.patch('/id/:id', auth(), joiMiddleware(agentSchemas.update), awaitHandlerFactory(agentController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(agentController.delete));
router.post('/login', joiMiddleware(agentSchemas.login), awaitHandlerFactory(agentController.agentLogin));

module.exports = router;