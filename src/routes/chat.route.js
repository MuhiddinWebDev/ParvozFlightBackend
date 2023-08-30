const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
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
        req.body.file = "voice_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.file);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'audio/mp4' || file.mimetype == 'audio/mp3' || file.mimetype == 'audio/mpeg') {
        cb(null, true);
    } else {
        // cb(new Error('file_only'));
        return cb(new Error('bunday type mavjud emas ' + (file.mimetype)))
        //return cb(new Error('Only images are allowed'))
    }
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
router.post('/create', auth(), joiMiddleware(chatSchemas), awaitHandlerFactory(chatController.created)); // webdan
router.patch('/id/:id', auth(), joiMiddleware(chatSchemas), awaitHandlerFactory(chatController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(chatController.delete));

module.exports = router;