const TechnicianProfile = require('../models/TechnicianProfile');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.createProfile = async (req, res, next) => {
    try {
        // 1. Check if user is actually a user with role TECHNICIAN
        if (req.user.role !== 'TECHNICIAN') {
            return next(new AppError('Only users with role TECHNICIAN can create a technician profile.', 403));
        }

        // 2. Check if profile already exists
        const existingProfile = await TechnicianProfile.findOne({ user: req.user.id });
        if (existingProfile) {
            return next(new AppError('Technician profile already exists.', 400));
        }

        // 3. Create Profile
        let profileData = {
            user: req.user.id,
            bio: req.body.bio,
            skills: req.body.skills,
            location: req.body.location,
            documents: {
                verificationStatus: 'PENDING'
            }
        };

        if (req.files) {
            if (req.files.profilePhoto) {
                profileData.profilePhoto = `${req.files.profilePhoto[0].filename}`;
            }
            if (req.files.aadharCard) profileData.documents.aadharCard = `${req.files.aadharCard[0].filename}`;
            if (req.files.panCard) profileData.documents.panCard = `${req.files.panCard[0].filename}`;
            if (req.files.drivingLicense) profileData.documents.drivingLicense = `${req.files.drivingLicense[0].filename}`;
            if (req.files.certificates) {
                profileData.documents.certificates = req.files.certificates.map(f => f.filename);
            }
        }

        const profile = await TechnicianProfile.create(profileData);

        res.status(201).json({
            status: 'success',
            data: { profile }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const updateData = { ...req.body };

        if (req.files) {
            if (req.files.profilePhoto) {
                updateData.profilePhoto = `${req.files.profilePhoto[0].filename}`;
            }
            if (req.files.aadharCard) updateData['documents.aadharCard'] = req.files.aadharCard[0].filename;
            if (req.files.panCard) updateData['documents.panCard'] = req.files.panCard[0].filename;
            if (req.files.drivingLicense) updateData['documents.drivingLicense'] = req.files.drivingLicense[0].filename;
            if (req.files.certificates) {
                updateData['documents.certificates'] = req.files.certificates.map(f => f.filename);
            }
            // If any document is uploaded, reset verification to PENDING
            if (req.files.aadharCard || req.files.panCard || req.files.drivingLicense || req.files.certificates) {
                updateData['documents.verificationStatus'] = 'PENDING';
            }
        }

        const profile = await TechnicianProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return next(new AppError('Technician profile not found. Please create one first.', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { profile }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllTechnicians = async (req, res, next) => {
    try {
        // Build Query
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Filtering by skills (simple regex partial match or exact)
        if (req.query.skills) {
            // Assume comma separated 'plumber,electrician'
            const skills = req.query.skills.split(',');
            queryObj.skills = { $in: skills };
        }

        // Filtering by rating
        if (req.query.rating) {
            queryObj.avgRating = { $gte: req.query.rating };
        }

        // Always show online first? Or filter by online?
        // queryObj.isOnline = true; // Optional: only show online technicians?

        let query = TechnicianProfile.find(queryObj).populate('user', 'name email');

        // Execute
        const technicians = await query;

        res.status(200).json({
            status: 'success',
            results: technicians.length,
            data: { technicians }
        });
    } catch (err) {
        next(err);
    }
};

exports.getTechnician = async (req, res, next) => {
    try {
        const technician = await TechnicianProfile.findById(req.params.id).populate('user', 'name email');

        if (!technician) {
            return next(new AppError('No technician found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { technician }
        });
    } catch (err) {
        next(err);
    }
};
exports.subscribeToPush = async (req, res, next) => {
    try {
        const profile = await TechnicianProfile.findOneAndUpdate(
            { user: req.user.id },
            { $addToSet: { pushSubscriptions: req.body } },
            { new: true }
        );

        if (!profile) {
            return next(new AppError('Technician profile not found', 404));
        }

        res.status(200).json({
            status: 'success',
            message: 'Subscribed to push notifications'
        });
    } catch (error) {
        next(error);
    }
};
