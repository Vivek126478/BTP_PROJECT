const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// POST /api/sos - Trigger SOS alert
router.post('/', authenticateToken, sosController.triggerSOS);

// GET /api/sos - Get SOS alerts (admin only)
router.get('/', authenticateToken, isAdmin, sosController.getSOSAlerts);

// PUT /api/sos/:id - Resolve SOS alert (admin only)
router.put('/:id', authenticateToken, isAdmin, sosController.resolveSOSAlert);

module.exports = router;
