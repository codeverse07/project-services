const express = require('express');
const userController = require('../../controllers/userController');
const authController = require('../../controllers/authController');
const authMiddleware = require('../../middlewares/auth');
const validate = require('../../utils/validate');
const userValidation = require('../../validations/user.validation');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

router.get('/me', authController.getMe, userController.getUser);
router.patch('/update-me', validate(userValidation.updateMe), userController.updateMe);
router.delete('/delete-me', userController.deleteMe);

module.exports = router;
