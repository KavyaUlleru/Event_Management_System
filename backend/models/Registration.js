const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    qrCode: {
        type: String,
        required: true
    },
    // Additional registration details
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    institutionName: {
        type: String,
        required: false
    },
    collegeBranch: {
        type: String,
        required: false
    },
    rollNo: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    attended: {
        type: Boolean,
        default: false
    },
    attendedAt: {
        type: Date
    },
    checkInLatitude: {
        type: Number,
        default: null
    },
    checkInLongitude: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ event: 1, participant: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
