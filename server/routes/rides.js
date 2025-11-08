const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/rides - Create a new ride
router.post('/', authenticateToken, rideController.createRide);

// GET /api/rides/search - Search rides with filters
router.get('/search', rideController.searchRides);

// GET /api/rides/user - Get user's rides
router.get('/user', authenticateToken, rideController.getUserRides);

// GET /api/rides/:id - Get ride by ID
router.get('/:id', rideController.getRideById);

// POST /api/rides/:id/join - Join a ride
router.post('/:id/join', authenticateToken, rideController.joinRide);

// POST /api/rides/:id/leave - Leave a ride
router.post('/:id/leave', authenticateToken, rideController.leaveRide);

// POST /api/rides/:id/cancel - Cancel a ride
router.post('/:id/cancel', authenticateToken, rideController.cancelRide);

// POST /api/rides/:id/complete - Complete a ride
router.post('/:id/complete', authenticateToken, rideController.completeRide);

module.exports = router;
