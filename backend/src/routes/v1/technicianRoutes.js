const express = require('express');
const technicianController = require('../../controllers/technicianController');
const authMiddleware = require('../../middlewares/auth');
const validate = require('../../utils/validate');
const technicianValidation = require('../../validations/technician.validation');
const upload = require('../../middlewares/upload');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Mount review router
router.use('/:technicianId/reviews', reviewRouter);

// Public routes (Discovery)
router.get('/', validate(technicianValidation.getTechnicians), technicianController.getAllTechnicians);
router.get('/:id', technicianController.getTechnician);

// Protected routes (Management)
router.use(authMiddleware.protect);

router.post('/documents',
    authMiddleware.restrictTo('TECHNICIAN'),
    upload.fields([
        { name: 'aadharCard', maxCount: 1 },
        { name: 'panCard', maxCount: 1 },
        { name: 'resume', maxCount: 1 }
    ]),
    technicianController.uploadDocuments
);

router.post(
    '/profile',
    authMiddleware.restrictTo('TECHNICIAN'),
    upload.fields([
        { name: 'profilePhoto', maxCount: 1 },
        { name: 'aadharCard', maxCount: 1 },
        { name: 'panCard', maxCount: 1 },
        { name: 'drivingLicense', maxCount: 1 },
        { name: 'certificates', maxCount: 5 }
    ]),
    validate(technicianValidation.createProfile),
    technicianController.createProfile
);

router.post(
    '/subscribe',
    authMiddleware.restrictTo('TECHNICIAN'),
    technicianController.subscribeToPush
);

module.exports = router;
