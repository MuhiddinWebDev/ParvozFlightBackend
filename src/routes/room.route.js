const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const auth = require('../middleware/auth.middleware');
const clientAuth = require('../middleware/clientAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { roomSchemas } = require('../middleware/validators/roomValidator.middleware');
const multer = require('multer');
const UniqueStringGenerator = require('unique-string-generator');
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/room/');
    },
    filename: function (req, file, cb) {
        const time = Math.floor(new Date().getTime());
        req.body.image = "room_" + time + "_" + UniqueStringGenerator.UniqueString() + path.extname(file.originalname);
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
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: fileFilter
}).single('image');


router.get('/', clientAuth(), awaitHandlerFactory(roomController.getAll));
router.get('/all', auth(), awaitHandlerFactory(roomController.getAll));
router.get('/table', auth(), awaitHandlerFactory(roomController.getAllWebTable));
router.get('/table/id/:id', auth(), awaitHandlerFactory(roomController.getByIdTable));
router.get('/deteil/id/:id', clientAuth(), awaitHandlerFactory(roomController.getDetail));
router.get('/id/:id', auth(), awaitHandlerFactory(roomController.getById));
router.post('/', auth(Role.Admin), upload, joiMiddleware(roomSchemas.room), awaitHandlerFactory(roomController.create));
router.patch('/id/:id', upload, auth(Role.Admin), joiMiddleware(roomSchemas.room), awaitHandlerFactory(roomController.update));
router.post('/table', auth(Role.Admin), upload, joiMiddleware(roomSchemas.roomTable), awaitHandlerFactory(roomController.createTable));
router.post('/house', joiMiddleware(roomSchemas.roomTable), awaitHandlerFactory(roomController.createTableMobil));
router.patch('/table/id/:id', upload, auth(Role.Admin), joiMiddleware(roomSchemas.roomTable), awaitHandlerFactory(roomController.updateTable));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(roomController.delete));
router.delete('/table/:id', auth(Role.Admin), awaitHandlerFactory(roomController.deleteTable));
router.post('/image', upload, awaitHandlerFactory(roomController.createImage));
router.post('/update-image', upload, awaitHandlerFactory(roomController.updateImage));

module.exports = router;