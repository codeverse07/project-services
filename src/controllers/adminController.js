const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const AppError = require('../utils/AppError');
const adminService = require('../services/adminService');

exports.getDashboardStats = async (req, res, next) => {
    try {
        // Run aggregation queries in parallel for performance
        const [
            totalUsers,
            totalWorkers,
            activeWorkers,
            totalServices,
            totalBookings,
            pendingApprovals,
            todaysBookings
        ] = await Promise.all([
            User.countDocuments({ role: 'USER' }), // Only count regular users? Or all? Let's count regular users.
            User.countDocuments({ role: 'WORKER' }),
            WorkerProfile.countDocuments({ isOnline: true }),
            Service.countDocuments(),
            Booking.countDocuments(),
            WorkerProfile.countDocuments({ 'documents.verificationStatus': 'PENDING' }),
            Booking.countDocuments({
                scheduledAt: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lt: new Date(new Date().setHours(23, 59, 59, 999))
                }
            })
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                totalUsers,
                totalWorkers,
                activeWorkers,
                totalServices,
                totalBookings,
                pendingApprovals,
                todaysBookings
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getAllWorkers = async (req, res, next) => {
    try {
        const { status, limit, page } = req.query;
        const filter = {};

        if (status) {
            filter['documents.verificationStatus'] = status.toUpperCase();
        }

        const workers = await WorkerProfile.find(filter)
            .populate('user', 'name email phone isActive') // Important: See user details
            .sort('-createdAt'); // Newest first

        res.status(200).json({
            status: 'success',
            results: workers.length,
            data: { workers }
        });
    } catch (error) {
        next(error);
    }
};

exports.approveWorker = async (req, res, next) => {
    try {
        const worker = await WorkerProfile.findById(req.params.id);
        if (!worker) return next(new AppError('Worker not found', 404));

        worker.documents.verificationStatus = 'VERIFIED';
        await worker.save();

        // LOG ACTION
        await adminService.logAction({
            adminId: req.user.id,
            action: 'WORKER_APPROVE',
            targetType: 'WorkerProfile',
            targetId: worker._id,
            details: { previousStatus: 'PENDING' }
        });

        res.status(200).json({ status: 'success', data: { worker } });
    } catch (error) {
        next(error);
    }
};

exports.rejectWorker = async (req, res, next) => {
    try {
        const worker = await WorkerProfile.findById(req.params.id);
        if (!worker) return next(new AppError('Worker not found', 404));

        worker.documents.verificationStatus = 'REJECTED';
        // worker.isOnline = false; // Force offline? Yes.
        await worker.save();

        // LOG ACTION
        await adminService.logAction({
            adminId: req.user.id,
            action: 'WORKER_REJECT',
            targetType: 'WorkerProfile',
            targetId: worker._id
        });

        res.status(200).json({ status: 'success', data: { worker } });
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, isActive, search } = req.query;
        const filter = {};

        if (role) filter.role = role.toUpperCase();
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter).select('-password');

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (error) {
        next(error);
    }
};

exports.toggleUserStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body; // Expect boolean
        const user = await User.findById(req.params.id);

        if (!user) return next(new AppError('User not found', 404));

        // Prevent disabling yourself (Admin)
        if (user._id.toString() === req.user.id) {
            return next(new AppError('You cannot disable your own admin account', 400));
        }

        user.isActive = isActive;
        await user.save({ validateBeforeSave: false }); // Skip validation just in case

        // LOG ACTION
        await adminService.logAction({
            adminId: req.user.id,
            action: isActive ? 'USER_ENABLE' : 'USER_DISABLE',
            targetType: 'User',
            targetId: user._id
        });

        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        next(error);
    }
};

exports.getAllServices = async (req, res, next) => {
    try {
        const { isActive, category, search } = req.query;
        const filter = {};

        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (category) filter.category = category;

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        const services = await Service.find(filter)
            .populate('worker', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: services.length,
            data: { services }
        });
    } catch (error) {
        next(error);
    }
};

exports.toggleServiceStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body; // Expect boolean
        const service = await Service.findById(req.params.id);

        if (!service) return next(new AppError('Service not found', 404));

        service.isActive = isActive;
        await service.save();

        // LOG ACTION
        await adminService.logAction({
            adminId: req.user.id,
            action: 'SERVICE_TOGGLE',
            targetType: 'Service',
            targetId: service._id,
            details: { newStatus: isActive }
        });

        res.status(200).json({ status: 'success', data: { service } });
    } catch (error) {
        next(error);
    }
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const { status, limit, page } = req.query;
        const filter = {};

        if (status) filter.status = status.toUpperCase();

        const bookings = await Booking.find(filter)
            .populate('customer', 'name email')
            .populate('worker', 'name email phone')
            .populate('service', 'title price')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings }
        });
    } catch (error) {
        next(error);
    }
};

exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return next(new AppError('Booking not found', 404));

        if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
            return next(new AppError(`Cannot cancel a booking that is already ${booking.status}`, 400));
        }

        const previousStatus = booking.status;
        booking.status = 'CANCELLED';
        await booking.save({ validateBeforeSave: false });

        // LOG ACTION
        await adminService.logAction({
            adminId: req.user.id,
            action: 'BOOKING_CANCEL',
            targetType: 'Booking',
            targetId: booking._id,
            details: { previousStatus, reason: 'Admin Force Cancel' }
        });

        res.status(200).json({ status: 'success', data: { booking } });
    } catch (error) {
        next(error);
    }
};
