const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Service must belong to a worker']
    },
    title: {
        type: String,
        required: [true, 'A service must have a title'],
        trim: true,
        maxlength: [100, 'Service title must have less than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'A service must have a description']
    },
    price: {
        type: Number,
        required: [true, 'A service must have a price'],
        min: [0, 'Price must be positive']
    },
    category: {
        type: String,
        required: [true, 'A service must have a category'],
        index: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

serviceSchema.index({ worker: 1, isActive: 1 });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
