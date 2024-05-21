const express = require('express');
const router = express.Router();
const ClientResumeController = require('../controllers/client_resume.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { clientResumeSchemas } = require('../middleware/validators/clientResumeValidator.middleware');


router.post('/search', auth(), awaitHandlerFactory(ClientResumeController.getAll));
router.get('/all', awaitHandlerFactory(ClientResumeController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(ClientResumeController.getById));
router.get('/one/id/:id', clientAuth(), awaitHandlerFactory(ClientResumeController.getById));
router.get('/own', clientAuth(), awaitHandlerFactory(ClientResumeController.getOwnClient));
router.post('/', clientAuth(), joiMiddleware(clientResumeSchemas.model), awaitHandlerFactory(ClientResumeController.create));
router.patch('/id/:id', auth(), joiMiddleware(clientResumeSchemas.model), awaitHandlerFactory(ClientResumeController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(ClientResumeController.delete));

module.exports = router;