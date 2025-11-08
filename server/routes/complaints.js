const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// POST /api/complaints - File a complaint
router.post('/', authenticateToken, complaintController.fileComplaint);

// GET /api/complaints - Get all complaints (admin only)
router.get('/', authenticateToken, isAdmin, complaintController.getAllComplaints);

// GET /api/complaints/user - Get user's complaints
router.get('/user', authenticateToken, complaintController.getUserComplaints);

// PUT /api/complaints/:id - Update complaint status (admin only)
router.put('/:id', authenticateToken, isAdmin, complaintController.updateComplaintStatus);

module.exports = router;
