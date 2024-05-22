const express = require('express');
const router = express.Router();
const staticOrderController = require('../controllers/static_order.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { orderSchemas } = require('../middleware/validators/staticOrderValidator.middleware');
const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/image/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.image = "client_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.image);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('image');

router.get('/all', auth(), awaitHandlerFactory(staticOrderController.getAll));
router.get('/client-order', clientAuth(), awaitHandlerFactory(staticOrderController.getByClient));
router.get('/id/:id', auth(), awaitHandlerFactory(staticOrderController.getById));
router.patch('/id/:id', auth(), joiMiddleware(orderSchemas.byAdmin), awaitHandlerFactory(staticOrderController.update));
router.post('/image', uploadFile, awaitHandlerFactory(staticOrderController.uploadImage));
router.delete('/id/:id', auth(), awaitHandlerFactory(staticOrderController.delete));
router.post('/del-image', auth(), awaitHandlerFactory(staticOrderController.deleteImage));

module.exports = router;