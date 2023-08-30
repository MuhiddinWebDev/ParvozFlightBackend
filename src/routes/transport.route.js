const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transport.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const agentAuth = require('../middleware/agentAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { transportSchemas } = require('../middleware/validators/transportValidator.middleware');

const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/reviews/');
    },
    filename: function (req, file, cb) {
        req.body.icon = UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.icon);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
        //return cb(new Error('Only images are allowed'))
    }
}

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('icon');


router.get('/', auth(Role.Admin), awaitHandlerFactory(transportController.getAll));
router.get('/all', clientAuth(), awaitHandlerFactory(transportController.getAll));
router.get('/all-transport', agentAuth(), awaitHandlerFactory(transportController.getAll));
router.get('/id/:id', auth(Role.Admin), awaitHandlerFactory(transportController.getById));
router.get('/one/id/:id', clientAuth(), awaitHandlerFactory(transportController.getById));
router.post('/', auth(Role.Admin), joiMiddleware(transportSchemas.create), awaitHandlerFactory(transportController.create));
router.patch('/id/:id', auth(Role.Admin), joiMiddleware(transportSchemas.create), awaitHandlerFactory(transportController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(transportController.delete));

router.post('/image', upload, auth(Role.Admin), awaitHandlerFactory(transportController.getUploadImage));

module.exports = router;