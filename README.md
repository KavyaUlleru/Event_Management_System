# Event Management System

A comprehensive web-based Event Management System with user authentication, event creation, online registration, QR-based digital ticketing, email notifications, attendance tracking, and analytics reporting.

## Features

### 1. User Authentication Module
- Secure user registration and login
- Role-based access control (Admin, Organizer, Participant)
- JWT-based authentication

### 2. Event Management Module
- Create, update, and delete events
- Event details: title, description, date, time, venue, capacity
- Real-time capacity tracking

### 3. Online Registration Module
- Browse and register for events
- Automatic capacity validation
- Prevent duplicate registrations

### 4. Digital Ticketing Module with QR Codes
- Automatic QR code generation upon registration
- Unique ticket IDs
- Secure ticket validation

### 5. Notification Module
- Email notifications for registration confirmation
- Event reminders
- HTML email templates

### 6. Attendance Management Module
- QR code scanning for attendance marking
- Real-time attendance tracking
- Prevent duplicate check-ins

### 7. Report and Analytics Module
- Event-specific reports (registrations, attendance)
- System-wide analytics (for admins)
- Attendance rate calculations

## Technology Stack

### Backend
- **Node.js** with **Express.js** - REST API server
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **qrcode** - QR code generation
- **nodemailer** - Email notifications

### Frontend
- **HTML5** - Structure
- **CSS3** - Modern, responsive styling with gradients and animations
- **JavaScript (ES6+)** - Client-side logic
- **html5-qrcode** - QR code scanning

## Project Structure

```
event-management-system/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── registrationController.js
│   │   └── reportController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── registrations.js
│   │   └── reports.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   └── emailService.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── app.js
    ├── index.html
    ├── events.html
    ├── dashboard.html
    ├── my-tickets.html
    ├── create-event.html
    ├── scan-qr.html
    └── reports.html
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Modern web browser

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event_management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Event Management System <noreply@eventmanagement.com>
```

4. Start MongoDB service

5. Run the server:
```bash
npm start
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Open `index.html` in a web browser, or use a local server:
```bash
# Using Python
python -m http.server 3000

# Using Node.js http-server
npx http-server -p 3000
```

3. Access the application at `http://localhost:3000`

## Usage

### For Participants
1. Register an account with "Participant" role
2. Browse available events
3. Register for events
4. View digital tickets with QR codes
5. Present QR code at event entrance

### For Organizers
1. Register an account with "Organizer" role
2. Create and manage events
3. Scan participant QR codes for attendance
4. View event reports and analytics

### For Admins
1. All organizer permissions
2. View system-wide analytics
3. Manage all events

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Organizer/Admin)
- `PUT /api/events/:id` - Update event (Organizer/Admin)
- `DELETE /api/events/:id` - Delete event (Organizer/Admin)

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/my-tickets` - Get user's tickets
- `GET /api/registrations/event/:eventId` - Get event registrations (Organizer/Admin)
- `POST /api/registrations/validate-qr` - Validate QR and mark attendance (Organizer/Admin)

### Reports
- `GET /api/reports/event/:eventId` - Get event report (Organizer/Admin)
- `GET /api/reports/overview` - Get system overview (Admin)

## Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS`

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- CORS enabled

## License
ISC

## Author
Event Management System Team
