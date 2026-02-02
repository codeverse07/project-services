const Service = require('../models/Service');
const AppError = require('../utils/AppError');

exports.createService = async (req, res, next) => {
    try {
        // 1. Create service linked to current user
        const newService = await Service.create({
            ...req.body,
            worker: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: { service: newService }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllServices = async (req, res, next) => {
    try {
        // Build Query
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Search feature
        if (req.query.search) {
            queryObj.title = { $regex: req.query.search, $options: 'i' };
        }

        let query = Service.find(queryObj).populate('worker', 'name email');

        // Sorting
        if (req.query.sort) {
            query = query.sort(req.query.sort);
        } else {
            query = query.sort('-createdAt');
        }

        const services = await query;

        res.status(200).json({
            status: 'success',
            results: services.length,
            data: { services }
        });
    } catch (err) {
        next(err);
    }
};

exports.getService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id).populate('worker', 'name email');
        if (!service) {
            return next(new AppError('No service found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { service }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return next(new AppError('No service found with that ID', 404));
        }

        // Check ownership
        if (service.worker.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to update this service', 403));
        }

        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: { service: updatedService }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return next(new AppError('No service found with that ID', 404));
        }

        // Check ownership (or Admin)
        if (service.worker.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return next(new AppError('You are not authorized to delete this service', 403));
        }

        await Service.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};
