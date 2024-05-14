const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatPro.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { chatSchemas } = require('../middleware/validators/chatValidator.middleware');

const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/voice/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        console.log(req.body.file)
        console.log("req.body.file___________________________________________-")
        req.body.file = "voice_file_image_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.file);
    }
})

const fileFilter = (req, file, cb) => {
    console.log('file mime type => ',file.mimetype);
    console.log('extra name => ',path.extname(file.originalname));
    console.log("file___________________________")
    console.log(file)
    cb(null, true);
}

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('voice');



router.get('/', auth(), awaitHandlerFactory(chatController.getOrderByChatListWeb));
router.get('/id/:id', clientAuth(), awaitHandlerFactory(chatController.getById));
// router.get('/all', auth(), awaitHandlerFactory(chatController.getAll));
router.get('/by-id/:id', auth(), awaitHandlerFactory(chatController.getById));
router.get('/order_id/:id', clientAuth(), awaitHandlerFactory(chatController.getAllChatByOrder));
router.get('/order-id/:id', auth(), awaitHandlerFactory(chatController.getAllChatByOrderWeb));
router.get('/chat-list', clientAuth(), awaitHandlerFactory(chatController.getOrderByChatList));
router.post('/', awaitHandlerFactory(chatController.create)); // mobildan create
router.post('/voice', clientAuth(), upload, awaitHandlerFactory(chatController.voice)); // mobil
router.post('/send-voice', auth(), upload, awaitHandlerFactory(chatController.voice)); // web

router.post('/file', clientAuth(), upload, awaitHandlerFactory(chatController.uploadFile)); // mobil
router.post('/send-file', auth(), upload, awaitHandlerFactory(chatController.uploadFile));

router.post('/image', clientAuth(), upload, awaitHandlerFactory(chatController.uploadImage)); // mobil
router.post('/send-image', auth(), upload, awaitHandlerFactory(chatController.uploadImage));

router.post('/create', auth(), joiMiddleware(chatSchemas), awaitHandlerFactory(chatController.created)); // webdan
router.patch('/id/:id', auth(), joiMiddleware(chatSchemas), awaitHandlerFactory(chatController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(chatController.delete));

module.exports = router;