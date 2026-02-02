const axios = require('axios');
const AppError = require('../utils/AppError');

exports.verifyRecaptcha = async (req, res, next) => {
    try {
        const { recaptchaToken } = req.body;


        // 1. Mock Mode for Testing/Dev (If keys missing or explicit mock token)
        if (
            process.env.NODE_ENV === 'test' ||
            recaptchaToken === 'mock-token' ||
            !process.env.RECAPTCHA_SECRET_KEY
        ) {
            if (recaptchaToken === 'mock-token' || !process.env.RECAPTCHA_SECRET_KEY) {
                // If using mock token or no secret configured, allow pass
                return next();
            }
        }

        if (!recaptchaToken) {
            return next(new AppError('Please complete the reCAPTCHA.', 400));
        }

        // 2. Verify with Google
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;

        const response = await axios.post(verificationURL);
        const { success, score } = response.data;

        if (!success) {
            return next(new AppError('reCAPTCHA verification failed. Please try again.', 400));
        }

        next();
    } catch (err) {
        console.error('Recaptcha Error:', err.message);
        next(new AppError('Error verifying reCAPTCHA', 500));
    }
};
