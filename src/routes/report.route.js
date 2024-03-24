const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.post('/order-report', auth(), awaitHandlerFactory(reportController.OrderReport));
router.post('/room-report', auth(), awaitHandlerFactory(reportController.RoomReport));
router.post('/work-report', auth(), awaitHandlerFactory(reportController.WorkReport));


module.exports = router;