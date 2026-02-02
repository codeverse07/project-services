const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./src/models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        const DB = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shridhar-backend';
        console.log('Connecting to:', DB.replace(/:[^:]*@/, ':****@')); // Mask password
        await mongoose.connect(DB);
        console.log('Connected to DB');

        const adminEmail = 'admin@example.com';
        const hashedPassword = 'Password123!';

        // Check if exists
        const exists = await User.findOne({ email: adminEmail });
        if (exists) {
            console.log('Admin already exists. Updating role to ADMIN just in case.');
            exists.role = 'ADMIN';
            // Update password to ensure we know it
            exists.password = hashedPassword;
            exists.passwordConfirm = hashedPassword;
            await exists.save();
            console.log('Admin updated.');
        } else {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                passwordConfirm: hashedPassword,
                role: 'ADMIN'
            });
            console.log('Admin created.');
        }

    } catch (err) {
        console.error('Seed Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

seedAdmin();
