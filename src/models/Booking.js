const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a customer']
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a worker']
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: [true, 'Booking must be for a service']
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'REFUNDED'],
        default: 'PENDING'
    },
    scheduledAt: {
        type: Date,
        required: [true, 'Booking must have a valid date']
    },
    price: {
        type: Number,
        required: [true, 'Booking must have a price']
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ worker: 1, status: 1 });
bookingSchema.index({ scheduledAt: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
