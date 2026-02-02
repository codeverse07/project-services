const User = require('../models/User');
const AppError = require('../utils/AppError');

// Helper to filter allowed fields
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (err) {
        next(err);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new AppError('No user found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        // 1) Create error if user POSTs password data
        if (req.body.password || req.body.passwordConfirm) {
            return next(new AppError('This route is not for password updates. Please use /update-password.', 400));
        }

        // 2) Filtered out unwanted field names that are not allowed to be updated
        // STRICTLY allow 'name', 'email' and new profile fields
        const filteredBody = filterObj(req.body, 'name', 'email', 'phone', 'address', 'location', 'profilePhoto');

        // 3) Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: { user: updatedUser }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { isActive: false });
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};
