const rateLimit = require('express-rate-limit');

// General API Rate Limiter
exports.globalLimiter = rateLimit({
    max: 100, // Limit each IP to 100 requests per 15 minutes
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

// Strict Limiter for Auth Routes (Brute Force Protection)
exports.authLimiter = rateLimit({
    max: 10, // Limit each IP to 10 login/register attempts per hour
    windowMs: 60 * 60 * 1000,
    message: 'Too many login attempts from this IP, please try again in an hour!'
});
