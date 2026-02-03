const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI not found in .env');
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    email: String,
    role: String
}, { strict: false }); // Disable strict to allow updating fields that might not match current schema temporarily

const User = mongoose.model('User', userSchema);

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected successfully.');

        // 1. Update all 'WORKER' roles to 'TECHNICIAN'
        console.log('Updating WORKER roles to TECHNICIAN...');
        const roleResult = await User.updateMany({ role: 'WORKER' }, { role: 'TECHNICIAN' });
        console.log(`Updated ${roleResult.modifiedCount} roles.`);

        // 2. Rename worker@reservice.com to technician@reservice.com
        console.log('Updating demo email...');
        const emailResult = await User.updateOne(
            { email: 'worker@reservice.com' },
            { email: 'technician@reservice.com' }
        );
        console.log(`Updated ${emailResult.modifiedCount} email.`);

        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
