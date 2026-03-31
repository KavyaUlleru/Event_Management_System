const express = require('express');
const router = express.Router();
const {
    registerForEvent,
    registerForEventGoogle,
    getMyTickets,
    getEventRegistrations,
    validateQRCode
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, registerForEvent);
router.post('/google-form-submit', registerForEventGoogle);
router.get('/my-tickets', protect, getMyTickets);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventRegistrations);
router.post('/validate-qr', protect, authorize('organizer', 'admin'), validateQRCode);

module.exports = router;
