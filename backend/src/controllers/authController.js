const { promisify } = require('util');
const crypto = require('crypto');
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

            passwordConfirm: req.body.passwordConfirm,
            phone: req.body.phone,
            role: req.body.role || 'USER' // Validation layer ensures only USER/TECHNICIAN
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`[AUTH] Login attempt: ${email}`);

        // 1) Check if email and password exist (Validation middleware does this too, but double check)
        if (!email || !password) {
            console.log('[AUTH] Missing email or password');
            return next(new AppError('Please provide email and password!', 400));
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');
        console.log(`[AUTH] User found: ${!!user}`);

        if (!user || !(await user.correctPassword(password, user.password))) {
            console.log('[AUTH] Invalid credentials');
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3) Check if user is active
        if (user.isActive === false) {
            console.log('[AUTH] User deactivated');
            return next(new AppError('Your account has been deactivated. Please contact support.', 403));
        }

        console.log(`[AUTH] Login success: ${email}`);
        // 3) If everything ok, send token to client
        createSendToken(user, 200, res);
    } catch (err) {
        console.error('[AUTH] Login Error:', err);
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

exports.forgotPassword = async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
    // OR Frontend URL: `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    // Usually we send a link to FRONTEND page.
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        const sendEmail = require('../utils/email');
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!'), 500);
    }
};

exports.resetPassword = async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    // user.passwordConfirm = req.body.passwordConfirm; // Schema I used had this? I removed it. 
    // I should ensure schema supports validation if I use it. 
    // My restored schema didn't have passwordConfirm field but pre-save hooks usually use it if present?
    // My logic uses `this.password = await bcrypt...`. 
    // I will just set password. User model pre-save will hash it.

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); // pre save middleware hashes password

    // 3) Log the user in, send JWT
    createSendToken(user, 200, res);
};
