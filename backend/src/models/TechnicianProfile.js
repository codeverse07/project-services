const mongoose = require('mongoose');

const technicianProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Technician profile must belong to a user.'],
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
    skills: {
        type: [String],
        validate: [v => v.length <= 2, 'A technician can have a maximum of 2 service categories.']
    },
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
        drivingLicense: String,
        certificates: [String],
        verificationStatus: {
            type: String,
            enum: ['PENDING', 'VERIFIED', 'REJECTED'],
            default: 'PENDING'
        }
    },
    pushSubscriptions: [
        {
            endpoint: String,
            keys: {
                p256dh: String,
                auth: String
            }
        }
    ]
}, {
    timestamps: true
});

technicianProfileSchema.index({ skills: 1 });
technicianProfileSchema.index({ isOnline: 1 });
// technicianProfileSchema.index({ user: 1 }); // Duplicate of schema definition

const TechnicianProfile = mongoose.model('TechnicianProfile', technicianProfileSchema);

module.exports = TechnicianProfile;
