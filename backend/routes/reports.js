const express = require('express');
const router = express.Router();
const {
    getEventReport,
    getSystemOverview
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventReport);
router.get('/overview', protect, authorize('admin'), getSystemOverview);

module.exports = router;
