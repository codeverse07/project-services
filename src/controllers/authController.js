const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { createSendToken } = require('../utils/jwt');

exports.register = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'USER' // Validation layer ensures only USER/WORKER
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist (Validation middleware does this too, but double check)
        if (!email || !password) {
            return next(new AppError('Please provide email and password!', 400));
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3) Check if user is active
        if (user.isActive === false) {
            return next(new AppError('Your account has been deactivated. Please contact support.', 403));
        }

        // 3) If everything ok, send token to client
        createSendToken(user, 200, res);
    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.status(200).json({ status: 'success' });
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
