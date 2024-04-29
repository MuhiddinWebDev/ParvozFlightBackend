const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { newSchemas } = require('../middleware/validators/newsValidator.middleware');
const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/image/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.image = "news_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.image);
    }
})

const fileFilter = (req, file, cb) => {
    console.log('file mime type => ', file.mimetype);
    console.log('extra name => ', path.extname(file.originalname));
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null, true);
    }else{
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

router.get('/all', auth(), awaitHandlerFactory(newsController.getAllWeb));
router.get('/', awaitHandlerFactory(newsController.getAllMobile));
router.get('/id/:id', auth(), awaitHandlerFactory(newsController.getById));
router.post('/', auth(), joiMiddleware(newSchemas.create), awaitHandlerFactory(newsController.create));
router.patch('/id/:id', auth(), joiMiddleware(newSchemas.create), awaitHandlerFactory(newsController.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(newsController.delete));
router.post('/image', uploadFile, awaitHandlerFactory(newsController.getUploadFile));

module.exports = router;