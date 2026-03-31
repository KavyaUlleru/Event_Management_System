# Quick Start Commands

## Backend Server (Already Running ✅)
```bash
cd "d:\event management system\backend"
npm start
```
Server: http://localhost:5000
Status: ✅ Running

## Frontend Access

### Option 1: Direct File (Easiest)
Just open in browser:
```
d:\event management system\frontend\index.html
```

### Option 2: HTTP Server
```bash
# Using Python
cd "d:\event management system\frontend"
python -m http.server 3000

# Using Node.js
npx http-server -p 3000
```
Then open: http://localhost:3000

## Test Accounts

### Participant
- Email: participant@test.com
- Password: test123
- Role: Participant

### Organizer
- Email: organizer@test.com
- Password: test123
- Role: Organizer

### Admin
- Email: admin@test.com
- Password: admin123
- Role: Admin

## Quick Test Flow

1. **Register** → Create account (Sign Up button)
2. **Login** → Access dashboard
3. **Create Event** (as Organizer) → Fill form
4. **Register for Event** (as Participant) → Browse events
5. **View Ticket** → My Tickets page (see QR code)
6. **Scan QR** (as Organizer) → Mark attendance
7. **View Report** → Check analytics

## API Endpoints

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"test123\",\"role\":\"participant\"}"
```

### Get Events
```bash
curl http://localhost:5000/api/events
```

## Email Configuration (Optional)

Edit `backend/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

For Gmail: Enable 2FA → Generate App Password

## Files Structure

```
event-management-system/
├── backend/              # API Server (Port 5000)
│   ├── controllers/     # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   └── services/        # Email service
└── frontend/            # Web Application
    ├── index.html       # Landing page
    ├── events.html      # Event listing
    ├── dashboard.html   # User dashboard
    ├── my-tickets.html  # Digital tickets
    ├── create-event.html # Event creation
    ├── scan-qr.html     # QR scanner
    └── reports.html     # Analytics
```

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify port 5000 is available
- Check .env file exists

### Frontend can't connect
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify API_URL in frontend/js/app.js

### QR Scanner not working
- Grant camera permissions
- Use HTTPS or localhost
- Check browser compatibility

### Email not sending
- Configure EMAIL_* variables in .env
- Use Gmail App Password (not regular password)
- Check spam folder

## All 7 Modules ✅

1. ✅ User Authentication (JWT, roles)
2. ✅ Event Management (CRUD)
3. ✅ Online Registration (capacity validation)
4. ✅ Digital Ticketing (QR codes)
5. ✅ Email Notifications (confirmations)
6. ✅ Attendance Management (QR scanning)
7. ✅ Reports & Analytics (metrics)

## Ready to Deploy! 🚀
