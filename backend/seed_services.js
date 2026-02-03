const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./src/models/Service');
const User = require('./src/models/User');

dotenv.config();

const seedServices = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // 1. Find or Create a Worker
        console.log('Looking for a Worker...');
        let worker = await User.findOne({ role: 'TECHNICIAN' });

        if (!worker) {
            console.log('No worker found. Creating a Seed Worker...');
            worker = await User.create({
                name: 'Seed Worker',
                email: 'worker@reservice.com',
                password: 'password123',
                passwordConfirm: 'password123',
                phone: '1112223333',
                role: 'TECHNICIAN'
            });
            console.log('Seed Worker created:', worker._id);
        } else {
            console.log('Found existing worker:', worker._id);
        }

        // 2. Define Sample Services
        const sampleServices = [
            {
                title: 'AC Repair & Service',
                description: 'Complete air styling and repair service including gas refill and filter cleaning.',
                price: 599,
                category: 'Appliance',
                worker: worker._id
            },
            {
                title: 'Deep House Cleaning',
                description: 'Full home deep cleaning service. Includes floor scrubbing, bathroom sanitation, and dusting.',
                price: 1299,
                category: 'Cleaning',
                worker: worker._id
            },
            {
                title: 'Plumbing Emergency',
                description: 'Fast response for leaking pipes, clogged drains, and bathroom fittings.',
                price: 399,
                category: 'Plumbing',
                worker: worker._id
            },
            {
                title: 'Electrical Safety Check',
                description: 'Comprehensive inspection of home wiring, switchboards, and appliances.',
                price: 299,
                category: 'Electrical',
                worker: worker._id
            },
            {
                title: 'Sofa Cleaning',
                description: 'Professional shampooing and vacuuming for your sofa sets.',
                price: 799,
                category: 'Cleaning',
                worker: worker._id
            }
        ];

        // 3. Clear existing services (optional, but good for clean seed)
        // await Service.deleteMany({}); 
        // console.log('Cleared existing services.');

        // 4. Insert Services
        console.log('Seeding Services...');
        await Service.insertMany(sampleServices);

        console.log(`✅ Successfully seeded ${sampleServices.length} services!`);

    } catch (err) {
        console.error('Error seeding services:', err);
    } finally {
        await mongoose.disconnect();
    }
};

seedServices();
