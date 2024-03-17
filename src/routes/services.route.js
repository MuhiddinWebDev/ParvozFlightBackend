const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { servicesSchemas } = require('../middleware/validators/servicesValidator.middleware');
const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/icon/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.icon = "icon_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
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

router.get('/', clientAuth(), awaitHandlerFactory(servicesController.getAll));
router.get('/all',  auth(), awaitHandlerFactory(servicesController.getAllWeb));
router.get('/detail/:id', clientAuth(), awaitHandlerFactory(servicesController.getDetail));
router.get('/id/:id',  auth(), awaitHandlerFactory(servicesController.getById));
router.post('/', upload,  auth(), joiMiddleware(servicesSchemas), awaitHandlerFactory(servicesController.create));
router.patch('/id/:id', upload,  auth(), joiMiddleware(servicesSchemas), awaitHandlerFactory(servicesController.update));
router.delete('/id/:id',  auth(), awaitHandlerFactory(servicesController.delete));

module.exports = router;