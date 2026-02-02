const express = require('express');
const notificationController = require('../../controllers/notificationController');
const authMiddleware = require('../../middlewares/auth');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
