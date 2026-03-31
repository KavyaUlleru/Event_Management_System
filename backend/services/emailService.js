const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send registration confirmation email
exports.sendRegistrationEmail = async (user, event, registration) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `Registration Confirmed - ${event.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .ticket-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .qr-code { text-align: center; margin: 20px 0; }
          .qr-code img { max-width: 250px; border: 2px solid #667eea; border-radius: 8px; padding: 10px; background: white; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          h1 { margin: 0; }
          .label { font-weight: bold; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Registration Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Your registration for <strong>${event.title}</strong> has been confirmed successfully!</p>
            
            <div class="ticket-info">
              <h2>Event Details</h2>
              <p><span class="label">Event:</span> ${event.title}</p>
              <p><span class="label">Date:</span> ${new Date(event.date).toLocaleDateString()}</p>
              <p><span class="label">Time:</span> ${event.time}</p>
              <p><span class="label">Venue:</span> ${event.venue}</p>
              <p><span class="label">Ticket ID:</span> ${registration.ticketId}</p>
            </div>

            <div class="qr-code">
              <h3>Your Digital Ticket</h3>
              <p>Present this QR code at the event entrance:</p>
              <img src="${registration.qrCode}" alt="QR Code Ticket" />
            </div>

            <p><strong>Important:</strong> Please save this email or take a screenshot of the QR code. You'll need to present it at the event venue for entry.</p>
            
            <p>We look forward to seeing you at the event!</p>
            
            <div class="footer">
              <p>This is an automated email from Event Management System. Please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send registration confirmation email for Google Form
exports.sendRegistrationEmailGoogle = async (emailAddress, event, registration) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: emailAddress,
    subject: `Registration Confirmed - ${event.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .ticket-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .qr-code { text-align: center; margin: 20px 0; }
          .qr-code img { max-width: 250px; border: 2px solid #667eea; border-radius: 8px; padding: 10px; background: white; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          h1 { margin: 0; }
          .label { font-weight: bold; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Registration Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${registration.name},</p>
            <p>Your registration for <strong>${event.title}</strong> has been confirmed successfully!</p>
            
            <div class="ticket-info">
              <h2>Event Details</h2>
              <p><span class="label">Event:</span> ${event.title}</p>
              <p><span class="label">Date:</span> ${new Date(event.date).toLocaleDateString()}</p>
              <p><span class="label">Time:</span> ${event.time}</p>
              <p><span class="label">Venue:</span> ${event.venue}</p>
              <p><span class="label">Ticket ID:</span> ${registration.ticketId}</p>
            </div>

            <div class="qr-code">
              <h3>Your Digital Ticket</h3>
              <p>Please show this QR code at the event entrance for verification:</p>
              <img src="${registration.qrCode}" alt="QR Code Ticket" />
            </div>

            <p><strong>Important:</strong> Please save this email or take a screenshot of the QR code. You'll need to present it at the event venue for entry.</p>
            
            <p>We look forward to seeing you at the event!</p>
            
            <div class="footer">
              <p>This is an automated email from Event Management System. Please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send event reminder email
exports.sendEventReminder = async (user, event) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `Reminder: ${event.title} is Tomorrow!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          h1 { margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Event Reminder</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>This is a friendly reminder that <strong>${event.title}</strong> is scheduled for tomorrow!</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p>Don't forget to bring your digital ticket (QR code) for entry.</p>
            <p>See you there!</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};
