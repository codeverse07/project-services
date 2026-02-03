const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const resetPassword = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const email = 'worker@reservice.com';
        const newPassword = 'password123';

        let user = await User.findOne({ email });

        if (!user) {
            console.log('User not found. Creating new Worker...');
            user = await User.create({
                name: 'Seed Worker',
                email,
                password: newPassword,
                passwordConfirm: newPassword,
                role: 'TECHNICIAN',
                phone: '1234567890'
            });
            console.log('Worker created.');
        } else {
            console.log('Found user. Resetting password...');
            user.password = newPassword;
            user.passwordConfirm = newPassword;
            await user.save();
            console.log('Password reset successfully.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

resetPassword();
