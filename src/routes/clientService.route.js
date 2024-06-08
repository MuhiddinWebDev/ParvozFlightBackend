const express = require('express');
const router = express.Router();
const clientServiceController = require('../controllers/clientService.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { clientServiceSchemas } = require('../middleware/validators/clientServiceValidator.middleware');
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
    cb(null, true);
}
let uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('image');
router.post('/all', auth(), awaitHandlerFactory(clientServiceController.getAllWeb));
router.get('/', awaitHandlerFactory(clientServiceController.getAllMobile));
router.get('/id/:id', auth(), awaitHandlerFactory(clientServiceController.getById));
router.get('/region/:id', clientAuth(), awaitHandlerFactory(clientServiceController.getByRegion));
router.post('/', auth(), joiMiddleware(clientServiceSchemas.create), awaitHandlerFactory(clientServiceController.create));
router.post('/order-by-client', clientAuth(), joiMiddleware(clientServiceSchemas.order), awaitHandlerFactory(clientServiceController.orderByClient));
router.patch('/id/:id', auth(), joiMiddleware(clientServiceSchemas.create), awaitHandlerFactory(clientServiceController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(clientServiceController.delete));
router.post('/image', uploadFile, awaitHandlerFactory(clientServiceController.UploadFile));

module.exports = router;