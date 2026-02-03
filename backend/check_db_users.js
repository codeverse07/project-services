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
});

const User = mongoose.model('User', userSchema);

async function checkUsers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected successfully.');

        const users = await User.find({}, 'email role');
        console.log('--- User List ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Role: ${u.role}`);
        });
        console.log('-----------------');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkUsers();
