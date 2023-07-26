const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { reviewsSchemas } = require('../middleware/validators/reviewsValidator.middleware');
const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/reviews/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.image = "reviews_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.image);
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
}).single('image');


router.get('/', clientAuth(), awaitHandlerFactory(reviewsController.getAll));
router.get('/all', auth(), awaitHandlerFactory(reviewsController.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(reviewsController.getById));
router.post('/', auth(Role.Admin), upload, joiMiddleware(reviewsSchemas), awaitHandlerFactory(reviewsController.create));
router.patch('/id/:id', upload, auth(Role.Admin), joiMiddleware(reviewsSchemas), awaitHandlerFactory(reviewsController.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(reviewsController.delete));

module.exports = router;