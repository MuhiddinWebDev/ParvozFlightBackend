const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.post('/order', auth(), awaitHandlerFactory(reportController.OrderReport));
router.post('/room-report', auth(), awaitHandlerFactory(reportController.RoomReport));
router.post('/room-sverka', auth(), awaitHandlerFactory(reportController.OrderReport));


module.exports = router;