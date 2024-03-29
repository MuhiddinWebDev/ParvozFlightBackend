const express = require('express');
const router = express.Router();
const serviceCategoryController = require('../controllers/serviceCategory.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { serviceCategorySchemas } = require('../middleware/validators/serviceCategoryValidator.middleware');const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/category/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.k_image = time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.k_image);
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
}).single('k_image');


router.get('/all', clientAuth(), awaitHandlerFactory(serviceCategoryController.getAll));
router.get('/',  auth(), awaitHandlerFactory(serviceCategoryController.getAllWeb));
router.get('/id/:id',  auth(), awaitHandlerFactory(serviceCategoryController.getById));
router.post('/',  auth(), upload, joiMiddleware(serviceCategorySchemas), awaitHandlerFactory(serviceCategoryController.create));
router.patch('/id/:id',  auth(), upload, awaitHandlerFactory(serviceCategoryController.update));
router.delete('/id/:id',  auth(), awaitHandlerFactory(serviceCategoryController.delete));

module.exports = router;