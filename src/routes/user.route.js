const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { userSchemas } = require('../middleware/validators/userValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(userController.getAll));
router.get('/sex', auth(), awaitHandlerFactory(userController.getSex));
router.get('/sex-phone', clientAuth(), awaitHandlerFactory(userController.getSex));
router.get('/phone', clientAuth(), awaitHandlerFactory(userController.getPhone));
router.get('/id/:id', auth(), awaitHandlerFactory(userController.getById));
router.get('/username/:username', auth(), awaitHandlerFactory(userController.getByUsername));
router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser));
router.post('/', auth(Role.Admin), joiMiddleware(userSchemas.create), awaitHandlerFactory(userController.create));
router.patch('/id/:id', auth(Role.Admin), joiMiddleware(userSchemas.update), awaitHandlerFactory(userController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(userController.delete));

router.post('/login', joiMiddleware(userSchemas.login), awaitHandlerFactory(userController.userLogin));

module.exports = router;