const express = require('express');
const adminController = require('../../controllers/adminController');
const { protect, restrictTo } = require('../../middlewares/auth');

const router = express.Router();

// CRITICAL: All admin routes are protected and restricted to ADMIN strictly
router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/dashboard-stats', adminController.getDashboardStats);

// --- USER MANAGEMENT ---
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus); // Body: { isActive: boolean }

// --- WORKER MANAGEMENT ---
router.get('/workers', adminController.getAllWorkers);
router.patch('/workers/:id/approve', adminController.approveWorker);
router.patch('/workers/:id/reject', adminController.rejectWorker);

// --- SERVICE MANAGEMENT ---
router.get('/services', adminController.getAllServices);
router.patch('/services/:id/status', adminController.toggleServiceStatus);

// --- BOOKING MANAGEMENT ---
router.get('/bookings', adminController.getAllBookings);
router.patch('/bookings/:id/cancel', adminController.cancelBooking);

// Placeholder for future modules
// router.use('/users', userModRoutes);

module.exports = router;
