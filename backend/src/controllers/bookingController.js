const Booking = require('../models/Booking');
const Service = require('../models/Service');
const AppError = require('../utils/AppError');
const notificationService = require('../services/notificationService');

exports.createBooking = async (req, res, next) => {
    try {
        const { serviceId, scheduledAt, notes } = req.body;

        // 1. Check if service exists AND is active
        const service = await Service.findById(serviceId).populate('worker');
        if (!service || !service.isActive) {
            return next(new AppError('Service not found or not active', 404));
        }

        // 2. Prevent technician from booking their own service
        if (service.worker._id.toString() === req.user.id) {
            return next(new AppError('You cannot book your own service', 400));
        }

        // 3. Create Booking
        const booking = await Booking.create({
            customer: req.user.id,
            worker: service.worker._id,
            service: serviceId,
            price: service.price,
            scheduledAt,
            notes
        });

        // 4. Send Notification to Technician
        await notificationService.send({
            recipient: service.worker._id,
            type: 'BOOKING_REQUEST',
            title: 'New Booking Request',
            message: `${req.user.name} has requested a booking for ${service.title}`,
            data: { bookingId: booking._id, serviceId: service._id }
        });

        res.status(201).json({
            status: 'success',
            data: {
                booking
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const { status } = req.query;
        const filter = {};

        // Auto-Cancel past pending bookings
        await Booking.updateMany(
            {
                status: 'PENDING',
                scheduledAt: { $lt: Date.now() }
            },
            { status: 'CANCELLED' }
        );

        // Filter by user role context
        if (req.user.role === 'TECHNICIAN') {
            filter.worker = req.user.id;
        } else if (req.user.role !== 'ADMIN') {
            filter.customer = req.user.id;
        }
        // If ADMIN, no filter is applied (returns all)

        if (status) {
            filter.status = status;
        }

        // Sorting Logic: Technician + Pending = Earliest First. Everyone else = Newest First.
        let sortStr = '-createdAt';
        if (req.user.role === 'TECHNICIAN' && status === 'PENDING') {
            sortStr = 'scheduledAt'; // Ascending (Earliest first)
        }

        const bookings = await Booking.find(filter)
            .populate('service', 'title price category')
            .populate('customer', 'name email phone location profilePhoto')
            .populate('worker', 'name email phone profilePhoto')
            .sort(sortStr);

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: {
                bookings
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate('service', 'title price category')
            .populate('customer', 'name email')
            .populate('worker', 'name email');

        if (!booking) {
            return next(new AppError('No booking found with that ID', 404));
        }

        // Security: Ensure user is related to this booking
        const isCustomer = booking.customer._id.toString() === req.user.id;
        const isTechnician = booking.worker._id.toString() === req.user.id;
        const isAdmin = req.user.role === 'ADMIN';

        if (!isCustomer && !isTechnician && !isAdmin) {
            return next(new AppError('You do not have permission to view this booking', 403));
        }

        res.status(200).json({
            status: 'success',
            data: {
                booking
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.bookingId).populate('service');

        if (!booking) {
            return next(new AppError('No booking found with that ID', 404));
        }

        const isTechnician = booking.worker.toString() === req.user.id;
        const isCustomer = booking.customer.toString() === req.user.id;

        // State Machine Logic
        if (status === 'CANCELLED') {
            // Both can cancel if pending or accepted
            if (!['PENDING', 'ACCEPTED'].includes(booking.status)) {
                return next(new AppError('Cannot cancel booking at this stage', 400));
            }
            // Notification target logic
            const recipient = isCustomer ? booking.worker : booking.customer;
            await notificationService.send({
                recipient,
                type: 'BOOKING_CANCELLED',
                title: 'Booking Cancelled',
                message: `Booking for ${booking.service.title} was cancelled`,
                data: { bookingId: booking._id }
            });
        }
        else if (['ACCEPTED', 'REJECTED'].includes(status)) {
            // Only Technician can accept/reject
            if (!isTechnician) return next(new AppError('Only technician can accept/reject', 403));
            if (booking.status !== 'PENDING') return next(new AppError('Can only update pending bookings', 400));

            await notificationService.send({
                recipient: booking.customer,
                type: `BOOKING_${status}`,
                title: `Booking ${status}`,
                message: `Your booking for ${booking.service.title} was ${status.toLowerCase()}`,
                data: { bookingId: booking._id }
            });
        }
        else if (['IN_PROGRESS', 'COMPLETED'].includes(status)) {
            // Only Technician can progress
            if (!isTechnician) return next(new AppError('Only technician can update progress', 403));

            // Validate flow: ACCEPTED -> IN_PROGRESS -> COMPLETED
            const isValidFlow =
                (booking.status === 'ACCEPTED' && status === 'IN_PROGRESS') ||
                (booking.status === 'IN_PROGRESS' && status === 'COMPLETED');

            if (!isValidFlow) return next(new AppError(`Invalid status transition from ${booking.status} to ${status}`, 400));

            await notificationService.send({
                recipient: booking.customer,
                type: `BOOKING_${status}`,
                title: `Booking Update: ${status.replace('_', ' ')}`,
                message: `Status update for ${booking.service.title}: ${status}`,
                data: { bookingId: booking._id }
            });
        }
        else {
            return next(new AppError('Invalid status provided', 400));
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({
            status: 'success',
            data: {
                booking
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getTechnicianStats = async (req, res, next) => {
    try {

        const stats = await Booking.aggregate([
            {
                $match: {
                    worker: req.user._id,
                    status: 'COMPLETED'
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: '$price' },
                    completedJobs: { $sum: 1 }
                }
            }
        ]);


        res.status(200).json({
            status: 'success',
            data: {
                stats: stats.length > 0 ? stats[0] : { totalEarnings: 0, completedJobs: 0 }
            }
        });
    } catch (error) {
        console.error('STATS AGGREGATION ERROR:', error);
        next(error);
    }
};
