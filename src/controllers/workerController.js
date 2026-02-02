const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.createProfile = async (req, res, next) => {
    try {
        // 1. Check if user is actually a user with role WORKER
        if (req.user.role !== 'WORKER') {
            return next(new AppError('Only users with role WORKER can create a worker profile.', 403));
        }

        // 2. Check if profile already exists
        const existingProfile = await WorkerProfile.findOne({ user: req.user.id });
        if (existingProfile) {
            return next(new AppError('Worker profile already exists.', 400));
        }

        // 3. Create Profile
        let profileData = {
            user: req.user.id,
            bio: req.body.bio,
            skills: req.body.skills,
            location: req.body.location
        };

        if (req.file) {
            profileData.profilePhoto = `${req.protocol}://${req.get('host')}/public/uploads/workers/${req.file.filename}`;
        } else if (req.body.profilePhoto) {
            profileData.profilePhoto = req.body.profilePhoto;
        }

        const profile = await WorkerProfile.create(profileData);

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
        if (req.file) {
            req.body.profilePhoto = `${req.protocol}://${req.get('host')}/public/uploads/workers/${req.file.filename}`;
        }

        const profile = await WorkerProfile.findOneAndUpdate(
            { user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!profile) {
            return next(new AppError('Worker profile not found. Please create one first.', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { profile }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllWorkers = async (req, res, next) => {
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
        // queryObj.isOnline = true; // Optional: only show online workers?

        let query = WorkerProfile.find(queryObj).populate('user', 'name email');

        // Execute
        const workers = await query;

        res.status(200).json({
            status: 'success',
            results: workers.length,
            data: { workers }
        });
    } catch (err) {
        next(err);
    }
};

exports.getWorker = async (req, res, next) => {
    try {
        const worker = await WorkerProfile.findById(req.params.id).populate('user', 'name email');

        if (!worker) {
            return next(new AppError('No worker found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { worker }
        });
    } catch (err) {
        next(err);
    }
};
exports.uploadDocuments = async (req, res, next) => {
    try {


        if (!req.files) {
            return next(new AppError('Please upload documents', 400));
        }

        const updateData = {
            'documents.verificationStatus': 'PENDING'
        };

        if (req.files.aadharCard) updateData['documents.aadharCard'] = req.files.aadharCard[0].path;
        if (req.files.panCard) updateData['documents.panCard'] = req.files.panCard[0].path;
        if (req.files.resume) updateData['documents.resume'] = req.files.resume[0].path;

        const profile = await WorkerProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return next(new AppError('Worker profile not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { profile }
        });
    } catch (error) {
        next(error);
    }
};
