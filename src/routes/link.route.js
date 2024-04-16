const express = require('express');
const router = express.Router();
const linkController = require('../controllers/link.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { linkSchemas } = require('../middleware/validators/linkValidator.middleware');
const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/link/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.image = "link_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
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

router.get('/all', auth(), awaitHandlerFactory(linkController.getAllWeb));
router.get('/', awaitHandlerFactory(linkController.getAllMobile));
router.get('/id/:id', auth(), awaitHandlerFactory(linkController.getById));
router.post('/', auth(), joiMiddleware(linkSchemas.create), awaitHandlerFactory(linkController.create));
router.patch('/id/:id', auth(), joiMiddleware(linkSchemas.create), awaitHandlerFactory(linkController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(linkController.delete));
router.post('/image', uploadFile, awaitHandlerFactory(linkController.getUploadFile));

module.exports = router;