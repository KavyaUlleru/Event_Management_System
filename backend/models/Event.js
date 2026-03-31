const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide event title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide event description']
    },
    date: {
        type: Date,
        required: [true, 'Please provide event date']
    },
    time: {
        type: String,
        required: [true, 'Please provide event time']
    },
    venue: {
        type: String,
        required: [true, 'Please provide event venue']
    },
    address: {
        type: String,
        required: [true, 'Please provide event address']
    },
    city: {
        type: String,
        required: [true, 'Please provide event city']
    },
    state: {
        type: String,
        required: [true, 'Please provide event state']
    },
    zip: {
        type: String,
        required: [true, 'Please provide event PIN code']
    },
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null
    },
    googleFormLink: {
        type: String,
        trim: true
    },
    capacity: {
        type: Number,
        required: [true, 'Please provide event capacity'],
        min: 1
    },
    registeredCount: {
        type: Number,
        default: 0
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'completed'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Virtual for available seats
eventSchema.virtual('availableSeats').get(function () {
    return this.capacity - this.registeredCount;
});

// Ensure virtuals are included in JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
