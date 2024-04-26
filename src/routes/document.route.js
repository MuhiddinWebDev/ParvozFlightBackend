const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { documentSchemas } = require('../middleware/validators/documentValidator.middleware');
const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/document/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.file = "doc_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.file);
    }
})

const fileFilter = (req, file, cb) => {
    console.log('file mime type => ', file.mimetype);
    console.log('extra name => ', path.extname(file.originalname));
    cb(null, true);
}

let uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('file');

router.get('/all', auth(), awaitHandlerFactory(documentController.getAllWeb));
router.get('/', awaitHandlerFactory(documentController.getAllMobile));
router.get('/id/:id', auth(), awaitHandlerFactory(documentController.getById));
router.post('/', auth(), joiMiddleware(documentSchemas.create), awaitHandlerFactory(documentController.create));
router.patch('/id/:id', auth(), joiMiddleware(documentSchemas.create), awaitHandlerFactory(documentController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(documentController.delete));
router.post('/file', uploadFile, awaitHandlerFactory(documentController.getUploadFile));

module.exports = router;