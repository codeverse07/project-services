const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

async function seedAndTest() {
    try {
        console.log('--- STARTING SEED & TEST (KNOWN ADMIN) ---');
        const rand = Math.floor(Math.random() * 100000);

        // 1. Login ADMIN
        console.log('\n1. Logging in ADMIN...');
        const adminEmail = 'admin@reservice.com';
        let adminToken;
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email: adminEmail, password: 'password123' });
            adminToken = loginRes.data.token;
            console.log('   Admin Token obtained.');
        } catch (err) {
            console.error('   Admin login failed:', err.response?.data || err.message);
            return;
        }

        // 2. Register TECHNICIAN
        console.log('\n2. Registering TECHNICIAN...');
        const techEmail = `tech${rand}@test.com`;
        let techId, techToken;
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: `Tech Guy ${rand}`,
                email: techEmail,
                password: 'password123',
                passwordConfirm: 'password123',
                role: 'TECHNICIAN'
            });
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email: techEmail, password: 'password123' });
            techToken = loginRes.data.token;
            techId = loginRes.data.data.user._id;
            console.log(`   Technician Created: ${techId}`);
        } catch (err) {
            console.error('   Tech reg failed:', err.response?.data || err.message);
            return;
        }

        // 3. Create Category
        console.log('\n3. Creating Category...');
        let catId;
        try {
            const catRes = await axios.post(`${API_URL}/categories`, {
                name: `Category ${rand}`,
                description: 'For testing',
                icon: 'home'
            }, { headers: { Authorization: `Bearer ${adminToken}` } });
            catId = catRes.data.data.category._id;
            console.log(`   Category Created: ${catId}`);
        } catch (err) {
            console.error('   Category creation failed:', err.response?.data || err.message);
            return;
        }

        // 4. Create Service
        console.log('\n4. Creating Service...');
        let serviceId;
        try {
            const serviceRes = await axios.post(`${API_URL}/services`, {
                title: `Service ${rand}`,
                description: 'A test service',
                category: catId,
                price: 100,
            }, { headers: { Authorization: `Bearer ${techToken}` } });
            serviceId = serviceRes.data.data.service._id;
            console.log(`   Service Created: ${serviceId}`);
        } catch (err) {
            console.error('   Service creation failed:', err.response?.data || err.message);
            return;
        }

        // 5. Register CUSTOMER
        console.log('\n5. Registering CUSTOMER...');
        const customerEmail = `customer${rand}@test.com`;
        let customerToken;
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: `Customer ${rand}`,
                email: customerEmail,
                password: 'password123',
                passwordConfirm: 'password123',
                role: 'USER'
            });
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email: customerEmail, password: 'password123' });
            customerToken = loginRes.data.token;
            console.log('   Customer Token obtained.');
        } catch (err) {
            console.error('   Customer registration failed', err.response?.data || err.message);
            return;
        }

        // 6. Create BOOKING
        console.log('\n6. Attempting Booking...');
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);

        try {
            const bookingRes = await axios.post(`${API_URL}/bookings`, {
                serviceId: serviceId,
                scheduledAt: futureDate.toISOString(),
                notes: 'Seeded test booking'
            }, { headers: { Authorization: `Bearer ${customerToken}` } });

            console.log('   >>> BOOKING SUCCESS! <<<');
            console.log('   ID:', bookingRes.data.data.booking._id);
            console.log('   Status:', bookingRes.data.data.booking.status);

            // 7. Verify Fetch
            console.log('\n7. Verifying Fetch...');
            const fetchRes = await axios.get(`${API_URL}/bookings`, {
                headers: { Authorization: `Bearer ${customerToken}` }
            });
            const bookings = fetchRes.data.data.bookings || fetchRes.data.data.docs;
            console.log('   Fetched Bookings Count:', bookings ? bookings.length : 0);
            if (bookings && bookings.length > 0) {
                console.log('   First Booking Service:', bookings[0].service.title);
            }

        } catch (err) {
            console.error('   !!! BOOKING FAILED !!!');
            console.error('   Status:', err.response?.status);
            console.error('   Error:', JSON.stringify(err.response?.data, null, 2));
        }

    } catch (err) {
        console.error('GLOBAL ERROR:', err.message);
    }
}

seedAndTest();
