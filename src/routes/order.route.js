const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const clientAuth = require('../middleware/clientAuth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path');
const { orderSchemas } = require('../middleware/validators/orderValidator.middleware');
const joiMiddleware = require('../middleware/joi.middleware');





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/image/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.image = "image_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
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

let uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('image');

const storageFile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/file/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.file = "file_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.file);
    }
})

const fileFilterFile = (req, file, cb) => {
    if (file.mimetype == 'application/doc' || file.mimetype == 'application/docx' || file.mimetype == 'application/pdf') {
        cb(null, true);
    } else {
        // cb(new Error('file_only'));
        return cb(new Error('bunday type mavjud emas ' + (file.mimetype)))
        //return cb(new Error('Only images are allowed'))
    }
}

let uploadFile = multer({
    storage: storageFile,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilterFile
}).single('file');

router.get('/', clientAuth(), awaitHandlerFactory(orderController.getAllByClient));
router.post('/all', auth(), awaitHandlerFactory(orderController.getAll));
router.get('/by-client', clientAuth(), awaitHandlerFactory(orderController.getAllByClient));
router.get('/unfinished', clientAuth(), awaitHandlerFactory(orderController.unfinishedOrdersByClient));
router.get('/id/:id', awaitHandlerFactory(orderController.getById));
router.post('/pay-client', auth(), awaitHandlerFactory(orderController.payClient));
router.post('/service_id/:id', clientAuth(), awaitHandlerFactory(orderController.create));
router.post('/create/service_id/:id', clientAuth(),  auth(), awaitHandlerFactory(orderController.created));
router.post('/step/action', awaitHandlerFactory(orderController.getStepAction));
router.post('/send/fields', clientAuth(), joiMiddleware(orderSchemas.sendFieldsMobil), awaitHandlerFactory(orderController.getSendFields));
router.post('/send-fields', auth(),  awaitHandlerFactory(orderController.sendFields));
router.post('/update-fields', auth(),  awaitHandlerFactory(orderController.sendFieldsUpdate));
router.post('/image', uploadImage, awaitHandlerFactory(orderController.getUploadImage));
router.post('/file', uploadFile, awaitHandlerFactory(orderController.getUploadFile));
router.patch('/id/:id', awaitHandlerFactory(orderController.update));
router.delete('/id/:id', clientAuth(), awaitHandlerFactory(orderController.delete));
router.delete('/order_id/:id', auth(), awaitHandlerFactory(orderController.deleteOrder));

module.exports = router;