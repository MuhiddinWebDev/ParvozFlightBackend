const express = require('express');
const router = express.Router();
const clientJobController = require('../controllers/clientJob.controller');

const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const { clientJobSchema } = require('../middleware/validators/clientJobValidator.middleware');


router.get('/', awaitHandlerFactory(clientJobController.getAll));
router.get('/child-all', awaitHandlerFactory(clientJobController.getAllChild));
router.get('/job-by', awaitHandlerFactory(clientJobController.getByIdJobAll));

router.get('/id/:id', awaitHandlerFactory(clientJobController.getById));
router.get('/child-id/:id', awaitHandlerFactory(clientJobController.getByIdChild));

router.post('/', joiMiddleware(clientJobSchema.job), awaitHandlerFactory(clientJobController.create));
router.post('/child-create', joiMiddleware(clientJobSchema.jobChild), awaitHandlerFactory(clientJobController.createChild));

router.patch('/id/:id', joiMiddleware(clientJobSchema.job), awaitHandlerFactory(clientJobController.update));
router.patch('/child-id/:id', joiMiddleware(clientJobSchema.jobChild), awaitHandlerFactory(clientJobController.updateChild));

router.delete('/id/:id', awaitHandlerFactory(clientJobController.delete));
router.delete('/child-id/:id', awaitHandlerFactory(clientJobController.deleteChild));

module.exports = router;