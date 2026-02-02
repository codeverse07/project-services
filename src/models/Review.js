const mongoose = require('mongoose');
const WorkerProfile = require('./WorkerProfile');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Rating is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    booking: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking',
        required: [true, 'Review must belong to a booking.'],
        unique: true // One review per booking
    },
    worker: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a worker.']
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a customer.']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.index({ booking: 1 }, { unique: true });
reviewSchema.index({ worker: 1 });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRatings = async function (workerUserId) {
    const stats = await this.aggregate([
        {
            $match: { worker: workerUserId }
        },
        {
            $group: {
                _id: '$worker',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await WorkerProfile.findOneAndUpdate(
            { user: workerUserId },
            {
                avgRating: Math.round(stats[0].avgRating * 10) / 10,
                totalJobs: stats[0].nRating // Or use totalJobs for accepted bookings? Let's use ratings count for now or separate
            }
        );
    } else {
        await WorkerProfile.findOneAndUpdate(
            { user: workerUserId },
            {
                avgRating: 4.5, // Default? or 0
                totalJobs: 0
            }
        );
    }
};

reviewSchema.post('save', function () {
    // this points to current review
    this.constructor.calcAverageRatings(this.worker);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
