const Registration = require('../models/Registration');
const Event = require('../models/Event');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('crypto');
const { sendRegistrationEmail, sendRegistrationEmailGoogle } = require('../services/emailService');

// Generate unique ticket ID
const generateTicketId = () => {
    return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private
exports.registerForEvent = async (req, res, next) => {
    try {
        const { eventId, name, email, institutionName, collegeBranch, rollNo, address } = req.body;
        const participantId = req.user.id;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event is active
        if (event.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Event is not active for registration'
            });
        }

        // Check if event has capacity
        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Event is full. No seats available'
            });
        }

        // Check if user already registered
        const existingRegistration = await Registration.findOne({
            event: eventId,
            participant: participantId
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }

        // Generate ticket ID and QR code
        const ticketId = generateTicketId();
        const qrData = JSON.stringify({
            ticketId,
            eventId,
            participantId,
            timestamp: new Date().toISOString()
        });

        const qrCodeDataURL = await QRCode.toDataURL(qrData);

        // Create registration
        const registration = await Registration.create({
            event: eventId,
            participant: participantId,
            ticketId,
            qrCode: qrCodeDataURL,
            name,
            email,
            institutionName,
            collegeBranch,
            rollNo,
            address
        });

        // Update event registered count
        event.registeredCount += 1;
        await event.save();

        // Populate registration details
        await registration.populate('event participant');

        // Send confirmation email
        try {
            await sendRegistrationEmail(req.user, event, registration);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the registration if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful! Check your email for ticket details.',
            registration
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register for an event via Google Form
// @route   POST /api/registrations/google-form-submit
// @access  Public
exports.registerForEventGoogle = async (req, res, next) => {
    try {
        const { eventId, fullName, registrationNumber, institutionName, branchDepartment, emailAddress } = req.body;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event is active
        if (event.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Event is not active for registration'
            });
        }

        // Check if event has capacity
        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Event is full. No seats available'
            });
        }

        // Check if email already registered for this event
        const existingRegistration = await Registration.findOne({
            event: eventId,
            email: emailAddress
        });
        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'This email is already registered for this event'
            });
        }

        // Generate ticket ID and QR code
        const ticketId = generateTicketId();
        const qrData = JSON.stringify({
            ticketId,
            eventId,
            email: emailAddress,
            timestamp: new Date().toISOString()
        });

        const qrCodeDataURL = await QRCode.toDataURL(qrData);

        // Create registration
        const registration = await Registration.create({
            event: eventId,
            ticketId,
            qrCode: qrCodeDataURL,
            name: fullName,
            email: emailAddress,
            institutionName,
            collegeBranch: branchDepartment,
            rollNo: registrationNumber
        });

        // Update event registered count
        event.registeredCount += 1;
        await event.save();

        // Populate registration details
        await registration.populate('event');

        // Send confirmation email
        try {
            await sendRegistrationEmailGoogle(emailAddress, event, registration);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the registration if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email for confirmation and QR code.',
            ticketId
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's tickets
// @route   GET /api/registrations/my-tickets
// @access  Private
exports.getMyTickets = async (req, res, next) => {
    try {
        const registrations = await Registration.find({ participant: req.user.id })
            .populate('event')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: registrations.length,
            registrations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get registrations for an event
// @route   GET /api/registrations/event/:eventId
// @access  Private (Organizer/Admin)
exports.getEventRegistrations = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check authorization
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these registrations'
            });
        }

        const registrations = await Registration.find({ event: req.params.eventId })
            .populate('participant', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: registrations.length,
            registrations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Validate QR code and mark attendance
// @route   POST /api/registrations/validate-qr
// @access  Private (Organizer/Admin)
exports.validateQRCode = async (req, res, next) => {
    try {
        const { qrData } = req.body;

        // Parse QR data
        let parsedData;
        try {
            parsedData = JSON.parse(qrData);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid QR code format'
            });
        }

        const { ticketId, eventId } = parsedData;

        // Find registration
        const registration = await Registration.findOne({ ticketId })
            .populate('event participant');

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Invalid ticket'
            });
        }

        // Verify event matches
        if (registration.event._id.toString() !== eventId) {
            return res.status(400).json({
                success: false,
                message: 'Ticket does not match this event'
            });
        }

        // Check if already attended
        if (registration.attended) {
            return res.status(400).json({
                success: false,
                message: 'Attendance already marked',
                attendedAt: registration.attendedAt
            });
        }

        // Mark attendance
        registration.attended = true;
        registration.attendedAt = new Date();
        await registration.save();

        res.status(200).json({
            success: true,
            message: 'Attendance marked successfully',
            participant: {
                name: registration.participant ? registration.participant.name : registration.name,
                email: registration.participant ? registration.participant.email : registration.email
            },
            event: {
                title: registration.event.title
            },
            attendedAt: registration.attendedAt
        });
    } catch (error) {
        next(error);
    }
};
