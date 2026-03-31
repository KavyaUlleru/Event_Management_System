const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ MongoDB Connected Successfully');
        
        // Create test event if none exists
        const Event = require('./models/Event');
        const User = require('./models/User');
        
        const eventCount = await Event.countDocuments();
        if (eventCount === 0) {
            const organizer = await User.findOne({ email: 'organizer@example.com' });
            if (organizer) {
                await Event.create({
                    title: 'Test Event',
                    description: 'This is a test event for demonstration purposes.',
                    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    time: '10:00',
                    venue: 'Test Venue',
                    address: '123 Test Street',
                    city: 'Test City',
                    state: 'Test State',
                    zip: '12345',
                    capacity: 100,
                    latitude: 28.6139,
                    longitude: 77.2090,
                    organizer: organizer._id
                });
                console.log('✅ Test event created');
            }
        } else {
            // Update existing events to have GPS coordinates if they don't
            const eventsWithoutCoords = await Event.find({ 
                $or: [
                    { latitude: null }, 
                    { longitude: null },
                    { latitude: { $exists: false } },
                    { longitude: { $exists: false } }
                ]
            });
            
            if (eventsWithoutCoords.length > 0) {
                await Event.updateMany(
                    { 
                        $or: [
                            { latitude: null }, 
                            { longitude: null },
                            { latitude: { $exists: false } },
                            { longitude: { $exists: false } }
                        ]
                    },
                    { 
                        $set: { 
                            latitude: 28.6139,
                            longitude: 77.2090
                        }
                    }
                );
                console.log(`✅ Updated ${eventsWithoutCoords.length} events with GPS coordinates`);
            }
            
            // Create test participant user and registration if needed
            const Registration = require('./models/Registration');
            const testParticipantEmail = 'participant@test.com';
            let testParticipant = await User.findOne({ email: testParticipantEmail });
            
            if (!testParticipant) {
                testParticipant = await User.create({
                    name: 'Test Participant',
                    email: testParticipantEmail,
                    password: 'password123',
                    role: 'participant'
                });
                console.log('✅ Test participant created');
            }
            
            // Check if participant has any registrations
            const registrationCount = await Registration.countDocuments({ 
                participant: testParticipant._id 
            });
            
            if (registrationCount === 0) {
                const event = await Event.findOne().sort({ createdAt: -1 });
                if (event) {
                    await Registration.create({
                        event: event._id,
                        participant: testParticipant._id,
                        name: testParticipant.name,
                        email: testParticipant.email,
                        institutionName: 'Test Institution',
                        collegeBranch: 'Computer Science',
                        rollNo: '12345',
                        address: 'Test Address',
                        ticketId: `TICKET-${Date.now()}`,
                        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
                    });
                    console.log('✅ Test registration created');
                }
            }
        }
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/reports', require('./routes/reports'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Event Management System API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` API URL: http://localhost:${PORT}`);
});
