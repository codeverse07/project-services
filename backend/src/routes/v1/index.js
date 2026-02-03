const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const technicianRoutes = require('./technicianRoutes');
const serviceRoutes = require('./serviceRoutes');
const bookingRoutes = require('./bookingRoutes');
const notificationRoutes = require('./notificationRoutes');
const adminRoutes = require('./adminRoutes');
const categoryRoutes = require('./categoryRoutes');

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/technicians', technicianRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/feedbacks', require('./feedbackRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/payments', require('./paymentRoutes'));
router.use('/ai', require('./aiRoutes'));

module.exports = router;
