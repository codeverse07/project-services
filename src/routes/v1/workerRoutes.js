const express = require('express');
const workerController = require('../../controllers/workerController');
const authMiddleware = require('../../middlewares/auth');
const validate = require('../../utils/validate');
const workerValidation = require('../../validations/worker.validation');
const upload = require('../../middlewares/upload');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Mount review router
router.use('/:workerId/reviews', reviewRouter);

// Public routes (Discovery)
router.get('/', validate(workerValidation.getWorkers), workerController.getAllWorkers);
router.get('/:id', workerController.getWorker);

// Protected routes (Management)
router.use(authMiddleware.protect);

router.post('/documents',
    authMiddleware.restrictTo('WORKER'),
    upload.fields([
        { name: 'aadharCard', maxCount: 1 },
        { name: 'panCard', maxCount: 1 },
        { name: 'resume', maxCount: 1 }
    ]),
    workerController.uploadDocuments
);

router.post(
    '/profile',
    authMiddleware.restrictTo('WORKER'),
    upload.single('profilePhoto'),
    validate(workerValidation.createProfile),
    workerController.createProfile
);

router.patch(
    '/profile',
    authMiddleware.restrictTo('WORKER'),
    upload.single('profilePhoto'),
    validate(workerValidation.updateProfile),
    workerController.updateProfile
);

module.exports = router;
