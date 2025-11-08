const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(isAdmin);

// GET /api/admin/users - Get all users
router.get('/users', adminController.getAllUsers);

// GET /api/admin/rides - Get all rides
router.get('/rides', adminController.getAllRides);

// PUT /api/admin/users/:userId/ban - Ban/Unban user
router.put('/users/:userId/ban', adminController.toggleUserBan);

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', adminController.getDashboardStats);

module.exports = router;
