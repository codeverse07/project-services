const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Transaction must belong to a user']
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Keeping it User (role TECHNICIAN) for flexibility, or TechnicianProfile? User usually better for financial linking
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: [true, 'Transaction must be linked to a booking']
    },
    amount: {
        type: Number,
        required: [true, 'Transaction must have an amount']
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
        default: 'PENDING'
    },
    paymentMethod: {
        type: String,
        enum: ['CASH', 'CARD', 'UPI', 'WALLET', 'SIMULATED'],
        default: 'SIMULATED'
    },
    transactionId: {
        type: String,
        unique: true
    },
    gatewayResponse: {
        type: Object // Store raw response from Stripe/Razorpay later
    }
}, {
    timestamps: true
});

transactionSchema.index({ user: 1 });
transactionSchema.index({ booking: 1 });
// transactionSchema.index({ transactionId: 1 }); // Duplicate of schema definition

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
