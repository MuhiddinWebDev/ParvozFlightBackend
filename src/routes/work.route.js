const express = require('express');
const router = express.Router();
const workController = require('../controllers/work.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { workSchemas } = require('../middleware/validators/workValidator.middleware');
const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/work/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.image = "work_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
        cb(null, req.body.image);
    }
})

const fileFilter = (req, file, cb) => {

    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/bmp' || file.mimetype == 'image/x-png') {
        
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


router.get('/', clientAuth(), awaitHandlerFactory(workController.getAll));
router.get('/all', auth(), awaitHandlerFactory(workController.getAllWeb));
router.post('/all/product', auth(), awaitHandlerFactory(workController.getAllWebProduct));
router.post('/all/test', awaitHandlerFactory(workController.testWorkTable));
router.get('/all-product', clientAuth(), awaitHandlerFactory(workController.getAllProduct));
router.get('/id/:id', auth(), awaitHandlerFactory(workController.getById));
router.get('/send-mobile/:id', auth(), awaitHandlerFactory(workController.sendMobilNotifaction));
router.post('/all-by-id', clientAuth(), awaitHandlerFactory(workController.getAllByIds));
// router.post('/all-by-id', awaitHandlerFactory(workController.getAllByIds));
router.get('/product/id/:id', auth(), awaitHandlerFactory(workController.getByIdProduct));
router.post('/',  auth(), joiMiddleware(workSchemas.createAdmin), awaitHandlerFactory(workController.create));
router.post('/create', clientAuth(), joiMiddleware(workSchemas.createProduct), awaitHandlerFactory(workController.createWork));
router.patch('/id/:id',  auth(), joiMiddleware(workSchemas.updateProduct), awaitHandlerFactory(workController.updateProduct));
router.post('/category/',  auth(), joiMiddleware(workSchemas.createCategory), awaitHandlerFactory(workController.createCategory));
router.patch('/category/id/:id',  auth(), joiMiddleware(workSchemas.createCategory), awaitHandlerFactory(workController.updateCategory));
router.delete('/id/:id',  auth(), awaitHandlerFactory(workController.delete));
router.delete('/product/id/:id',  auth(), awaitHandlerFactory(workController.deleteProduct));
router.post('/image', upload,  auth(), awaitHandlerFactory(workController.getUploadImage));
router.post('/images', upload, awaitHandlerFactory(workController.getUploadImageMobil));

module.exports = router;