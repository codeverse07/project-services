const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Worker profile must belong to a user.'],
        unique: true
    },
    profilePhoto: {
        type: String,
        default: 'default.jpg'
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    skills: [{
        type: String,
        trim: true
    }],
    isOnline: {
        type: Boolean,
        default: false
    },
    avgRating: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be above 0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10
    },
    totalJobs: {
        type: Number,
        default: 0
    },
    location: {
        // GeoJSON for future location features
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String
    },
    documents: {
        aadharCard: String,
        panCard: String,
        resume: String,
        verificationStatus: {
            type: String,
            enum: ['PENDING', 'VERIFIED', 'REJECTED'],
            default: 'PENDING'
        }
    }
}, {
    timestamps: true
});

workerProfileSchema.index({ skills: 1 });
workerProfileSchema.index({ isOnline: 1 });
workerProfileSchema.index({ user: 1 });

const WorkerProfile = mongoose.model('WorkerProfile', workerProfileSchema);

module.exports = WorkerProfile;
