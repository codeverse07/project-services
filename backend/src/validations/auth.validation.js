const Joi = require('joi');

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        name: Joi.string().required(),
        role: Joi.string().valid('USER', 'TECHNICIAN').default('USER'),
        passwordConfirm: Joi.string().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords must match' }),
        phone: Joi.string().optional(),
        recaptchaToken: Joi.string().optional()
    }),
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

module.exports = {
    register,
    login,
};
