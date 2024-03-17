const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/tickets.controller');
const auth = require('../middleware/auth.middleware');
const agentAuth = require('../middleware/agentAuth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { ticketsSchemas } = require('../middleware/validators/ticketsValidator.middleware');

const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/image/');
    },
    filename: function (req, file, cb) {
        req.body.image = UniqueStringGenerator.UniqueString(32) + path.extname(file.originalname);
        cb(null, req.body.image);
    }
})

const fileFilter = (req, file, cb) => {
    console.log('file mime type => ',file.mimetype);
    console.log('extra name => ',path.extname(file.originalname));
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/bmp' || file.mimetype == 'image/x-png') {
        cb(null, true);
    } else {
        // cb(new Error('image_only'));
         cb(new Error('bunday type mavjud emas ' + (file.mimetype)))
        //return cb(new Error('Only images are allowed'))
    }
}

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('image');


router.get('/', awaitHandlerFactory(ticketsController.getAll));
router.get('/all', clientAuth(), awaitHandlerFactory(ticketsController.getAllMobil));
router.get('/by-client', clientAuth(), awaitHandlerFactory(ticketsController.getAllByClient));
router.get('/by-agent', agentAuth(), awaitHandlerFactory(ticketsController.getAllByAgent));
router.get('/id/:id',  auth(), awaitHandlerFactory(ticketsController.getById));
router.get('/one/id/:id', clientAuth(), awaitHandlerFactory(ticketsController.getById));
router.post('/', clientAuth(), awaitHandlerFactory(ticketsController.create));
router.post('/create',  auth(), joiMiddleware(ticketsSchemas.createAdmin), awaitHandlerFactory(ticketsController.createAdmin));
router.post('/add', agentAuth(), joiMiddleware(ticketsSchemas.createAgent), awaitHandlerFactory(ticketsController.createAgent));
router.post('/image', agentAuth(), upload, awaitHandlerFactory(ticketsController.uploadImage));
router.post('/image-admin',   auth(), upload, awaitHandlerFactory(ticketsController.uploadImage));
router.patch('/id/:id',  auth(), joiMiddleware(ticketsSchemas.update), awaitHandlerFactory(ticketsController.update));
router.delete('/id/:id',  auth(), awaitHandlerFactory(ticketsController.delete));

module.exports = router;