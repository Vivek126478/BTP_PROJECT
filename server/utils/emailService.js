const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send OTP email
exports.sendOTPEmail = async (email, otp) => {
  try {
    console.log('Email service - Creating transporter...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Campus Wheels - IIIT Kottayam" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Campus Wheels Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background-color: #4F46E5; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Campus Wheels</h1>
            <p style="color: #E0E7FF; margin: 5px 0 0 0;">IIIT Kottayam Carpooling Platform</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1F2937; margin-top: 0;">Email Verification</h2>
            <p style="color: #4B5563; font-size: 16px;">Your One-Time Password (OTP) for email verification is:</p>
            
            <div style="background-color: #EEF2FF; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">${otp}</h1>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
              <strong>⏱️ This OTP will expire in 10 minutes.</strong>
            </p>
            
            <p style="color: #6B7280; font-size: 14px;">
              If you didn't request this OTP, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 25px 0;">
            
            <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
              This is an automated email from Campus Wheels. Please do not reply.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

// Send SOS email
exports.sendSOSEmail = async (sosDetails) => {
  try {
    const emergencyContacts = [
      process.env.SOS_EMAIL_1,
      process.env.SOS_EMAIL_2
    ].filter(Boolean);

    if (emergencyContacts.length === 0) {
      console.warn('No emergency contacts configured');
      return;
    }

    const locationLink = sosDetails.latitude && sosDetails.longitude
      ? `https://www.google.com/maps?q=${sosDetails.latitude},${sosDetails.longitude}`
      : 'Location not available';

    const mailOptions = {
      from: `"D-CARPOOL SOS" <${process.env.EMAIL_USER}>`,
      to: emergencyContacts.join(','),
      subject: '🚨 URGENT: SOS Alert from D-CARPOOL',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 3px solid #DC2626; padding: 20px;">
          <h1 style="color: #DC2626; text-align: center;">🚨 SOS ALERT 🚨</h1>
          <p style="font-size: 16px; font-weight: bold;">An SOS alert has been triggered on D-CARPOOL.</p>
          
          <h3>User Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${sosDetails.userName}</li>
            <li><strong>Email:</strong> ${sosDetails.userEmail}</li>
            <li><strong>Phone:</strong> ${sosDetails.userPhone || 'Not provided'}</li>
          </ul>

          <h3>Driver Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${sosDetails.driverName}</li>
            <li><strong>Phone:</strong> ${sosDetails.driverPhone || 'Not provided'}</li>
          </ul>

          <h3>Ride Details:</h3>
          <ul>
            <li><strong>From:</strong> ${sosDetails.rideDetails.startLocation}</li>
            <li><strong>To:</strong> ${sosDetails.rideDetails.endLocation}</li>
            <li><strong>Scheduled Time:</strong> ${new Date(sosDetails.rideDetails.rideDateTime).toLocaleString()}</li>
          </ul>

          <h3>Current Location:</h3>
          <p>${sosDetails.currentLocation || 'Not provided'}</p>
          ${sosDetails.latitude && sosDetails.longitude ? 
            `<p><a href="${locationLink}" style="color: #DC2626; font-weight: bold;">View on Google Maps</a></p>` : ''}

          ${sosDetails.message ? `
          <h3>Message:</h3>
          <p style="background-color: #FEE2E2; padding: 10px; border-radius: 5px;">${sosDetails.message}</p>
          ` : ''}

          <h3>Alert Details:</h3>
          <ul>
            <li><strong>Alert ID:</strong> ${sosDetails.alertId}</li>
            <li><strong>Timestamp:</strong> ${new Date(sosDetails.timestamp).toLocaleString()}</li>
          </ul>

          <p style="color: #DC2626; font-weight: bold; margin-top: 20px;">
            Please take immediate action and contact the user or local authorities if necessary.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('SOS email sent to emergency contacts');
  } catch (error) {
    console.error('Error sending SOS email:', error);
    throw error;
  }
};

// Send ride notification
exports.sendRideNotification = async (email, username, rideDetails, type) => {
  try {
    let subject, message;

    switch (type) {
      case 'joined':
        subject = 'Ride Joined Successfully';
        message = `You have successfully joined a ride from ${rideDetails.startLocation} to ${rideDetails.endLocation}.`;
        break;
      case 'cancelled':
        subject = 'Ride Cancelled';
        message = `The ride from ${rideDetails.startLocation} to ${rideDetails.endLocation} has been cancelled.`;
        break;
      case 'completed':
        subject = 'Ride Completed';
        message = `Your ride from ${rideDetails.startLocation} to ${rideDetails.endLocation} has been completed. Please rate your experience!`;
        break;
      default:
        return;
    }

    const mailOptions = {
      from: `"D-CARPOOL" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">${subject}</h2>
          <p>Hi ${username},</p>
          <p>${message}</p>
          <h3>Ride Details:</h3>
          <ul>
            <li><strong>From:</strong> ${rideDetails.startLocation}</li>
            <li><strong>To:</strong> ${rideDetails.endLocation}</li>
            <li><strong>Date & Time:</strong> ${new Date(rideDetails.rideDateTime).toLocaleString()}</li>
          </ul>
          <p>Thank you for using D-CARPOOL!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`${type} notification sent to:`, email);
  } catch (error) {
    console.error('Error sending ride notification:', error);
  }
};
