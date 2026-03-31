const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

// @desc    Get event report
// @route   GET /api/reports/event/:eventId
// @access  Private (Organizer/Admin)
exports.getEventReport = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.eventId).populate('organizer', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check authorization
        if (event.organizer._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this report'
            });
        }

        // Get registrations
        const registrations = await Registration.find({ event: req.params.eventId })
            .populate('participant', 'name email');

        // Calculate statistics
        const totalRegistrations = registrations.length;
        const attendedCount = registrations.filter(r => r.attended).length;
        const attendanceRate = totalRegistrations > 0
            ? ((attendedCount / totalRegistrations) * 100).toFixed(2)
            : 0;

        res.status(200).json({
            success: true,
            report: {
                event: {
                    id: event._id,
                    title: event.title,
                    date: event.date,
                    time: event.time,
                    venue: event.venue,
                    capacity: event.capacity,
                    status: event.status,
                    organizer: event.organizer
                },
                statistics: {
                    totalCapacity: event.capacity,
                    totalRegistrations,
                    availableSeats: event.capacity - totalRegistrations,
                    attendedCount,
                    notAttendedCount: totalRegistrations - attendedCount,
                    attendanceRate: `${attendanceRate}%`,
                    registrationRate: `${((totalRegistrations / event.capacity) * 100).toFixed(2)}%`
                },
                registrations: registrations.map(r => ({
                    participant: r.participant || { name: r.name, email: r.email },
                    ticketId: r.ticketId,
                    registeredAt: r.createdAt,
                    attended: r.attended,
                    attendedAt: r.attendedAt
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get system overview analytics
// @route   GET /api/reports/overview
// @access  Private (Admin)
exports.getSystemOverview = async (req, res, next) => {
    try {
        // Total counts
        const totalEvents = await Event.countDocuments();
        const activeEvents = await Event.countDocuments({ status: 'active' });
        const totalUsers = await User.countDocuments();
        const totalRegistrations = await Registration.countDocuments();

        // Events by status
        const eventsByStatus = await Event.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Users by role
        const usersByRole = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Recent events
        const recentEvents = await Event.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('organizer', 'name email');

        // Top events by registration
        const topEvents = await Event.find()
            .sort({ registeredCount: -1 })
            .limit(5)
            .populate('organizer', 'name email');

        res.status(200).json({
            success: true,
            overview: {
                summary: {
                    totalEvents,
                    activeEvents,
                    totalUsers,
                    totalRegistrations
                },
                eventsByStatus,
                usersByRole,
                recentEvents,
                topEvents
            }
        });
    } catch (error) {
        next(error);
    }
};
