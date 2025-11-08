const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/ratings - Submit a rating
router.post('/', authenticateToken, ratingController.submitRating);

// GET /api/ratings/user/:userId - Get user's ratings
router.get('/user/:userId', ratingController.getUserRatings);

// GET /api/ratings/can-rate - Check if user can rate
router.get('/can-rate', authenticateToken, ratingController.canRate);

module.exports = router;
