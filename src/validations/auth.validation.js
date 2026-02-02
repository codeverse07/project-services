const Joi = require('joi');

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        name: Joi.string().required(),
        role: Joi.string().valid('USER', 'WORKER').default('USER'),
        passwordConfirm: Joi.string().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords must match' }),
        recaptchaToken: Joi.string()
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
