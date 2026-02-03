const Review = require('../models/Review');
const Booking = require('../models/Booking');
const AppError = require('../utils/AppError');

exports.createReview = async (req, res, next) => {
    try {
        const { rating, review } = req.body;
        const { bookingId } = req.params;

        // 1. Check if booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return next(new AppError('No booking found with that ID', 404));
        }

        // 2. Check if user is the customer
        if (booking.customer.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to review this booking', 403));
        }

        // 3. Check if booking is COMPLETED
        if (booking.status !== 'COMPLETED') {
            return next(new AppError('You can only review completed bookings', 400));
        }

        // 4. Create Review
        const newReview = await Review.create({
            review,
            rating,
            booking: bookingId,
            customer: req.user.id,
            technician: booking.technician
        });

        res.status(201).json({
            status: 'success',
            data: { review: newReview }
        });

    } catch (err) {
        // Handle Duplicate Review (Unique Index)
        if (err.code === 11000) {
            return next(new AppError('You have already reviewed this booking', 400));
        }
        next(err);
    }
};

exports.getTechnicianReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ technician: req.params.technicianId })
            .populate('customer', 'name profilePhoto')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: { reviews }
        });
    } catch (err) {
        next(err);
    }
};
