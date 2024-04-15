const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisement.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { advertisementSchemas } = require('../middleware/validators/advertisementValidator.middleware');
const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/advertisement/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.image = "adver_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.image);
    }
})

const fileFilter = (req, file, cb) => {
    console.log('file mime type => ', file.mimetype);
    console.log('extra name => ', path.extname(file.originalname));
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

router.get('/all', auth(), awaitHandlerFactory(advertisementController.getAllWeb));
router.get('/', awaitHandlerFactory(advertisementController.getAllMobile));
router.get('/id/:id', auth(), awaitHandlerFactory(advertisementController.getById));
router.post('/', auth(), joiMiddleware(advertisementSchemas.create), awaitHandlerFactory(advertisementController.create));
router.patch('/id/:id', auth(), joiMiddleware(advertisementSchemas.create), awaitHandlerFactory(advertisementController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(advertisementController.delete));
router.post('/image', uploadFile, awaitHandlerFactory(advertisementController.getUploadFile));

module.exports = router;