const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { clientSchemas } = require('../middleware/validators/clientValidator.middleware');
const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/client/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.file = "client_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.file);
    }
})

const fileFilter = (req, file, cb) => {
    console.log('file mime type => ',file.mimetype);
    console.log('extra name => ',path.extname(file.originalname));
    console.log(file)
    cb(null, true);
}

let uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('file');

router.get('/',   auth(), awaitHandlerFactory(clientController.getAll));
router.get('/id/:id',   auth(), awaitHandlerFactory(clientController.getById));
router.get('/client',  clientAuth(), awaitHandlerFactory(clientController.currentClient));
router.get('/phone/:phone', auth(), awaitHandlerFactory(clientController.getByPhoneNumber));
router.post('/phone', joiMiddleware(clientSchemas.checkPhone), awaitHandlerFactory(clientController.checkPhone));
router.get('/get-client', clientAuth(), awaitHandlerFactory(clientController.getClient));
router.post('/',  auth(), joiMiddleware(clientSchemas.create), awaitHandlerFactory(clientController.create));
router.post('/promocode', awaitHandlerFactory(clientController.checkPromocode));
router.patch('/id/:id', clientAuth(), joiMiddleware(clientSchemas.update), awaitHandlerFactory(clientController.update));
router.patch('/update/id/:id', auth(), joiMiddleware(clientSchemas.update), awaitHandlerFactory(clientController.update));
router.delete('/id/:id',  auth(), awaitHandlerFactory(clientController.delete));
router.post('/file', uploadFile, awaitHandlerFactory(clientController.getUploadFile));
router.post('/login', joiMiddleware(clientSchemas.login), awaitHandlerFactory(clientController.clientLogin));
router.post('/sign-in', joiMiddleware(clientSchemas.signIn), awaitHandlerFactory(clientController.clientSignIn));

module.exports = router;