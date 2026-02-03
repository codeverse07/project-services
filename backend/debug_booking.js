const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

async function testBooking() {
    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'user@reservice.com',
            password: 'password123'
        }).catch(async (err) => {
            if (err.response?.status === 401) {
                console.log('   Login failed, trying to register temp user...');
                const rand = Math.floor(Math.random() * 1000);
                return await axios.post(`${API_URL}/auth/register`, {
                    name: `Debug User ${rand}`,
                    email: `debug${rand}@test.com`,
                    password: 'password123',
                    passwordConfirm: 'password123',
                    role: 'USER'
                });
            }
            throw err;
        });

        const token = loginRes.data.token;
        console.log('   Logged in successfully.');

        console.log('2. Fetching Services...');
        const serviceRes = await axios.get(`${API_URL}/services`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const services = serviceRes.data.data.services;
        if (!services || services.length === 0) {
            console.error('   No services found! Cannot book.');
            return;
        }
        const service = services[0];
        console.log(`   Found service: ${service.title} (ID: ${service._id})`);

        console.log('3. Creating Booking...');
        // Create a date 2 days in the future
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 2);

        const bookingPayload = {
            serviceId: service._id,
            scheduledAt: futureDate.toISOString(),
            notes: 'Debug booking test'
        };

        try {
            const bookingRes = await axios.post(`${API_URL}/bookings`, bookingPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('   Booking Created SUCCESS:', bookingRes.data);
        } catch (err) {
            console.error('\n!!! BOOKING FAILED !!!');
            console.error('Status:', err.response?.status);
            console.error('Data:', JSON.stringify(err.response?.data, null, 2));
        }

    } catch (err) {
        console.error('Test Script Error:', err.message);
        if (err.response) {
            console.error('Response Data:', err.response.data);
        }
    }
}

testBooking();
