const express = require('express');
const router = express.Router();
const {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getEvents)
    .post(protect, authorize('organizer', 'admin'), createEvent);

router.route('/:id')
    .get(getEvent)
    .put(protect, authorize('organizer', 'admin'), updateEvent)
    .delete(protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;
