const { EmailVerification } = require('../models');
const { sendOTPEmail } = require('../utils/emailService');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email domain
    const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || '@iiitkottayam.ac.in';
    if (!email.endsWith(allowedDomain)) {
      return res.status(400).json({ 
        error: `Only ${allowedDomain} emails are allowed` 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email
    await EmailVerification.destroy({ where: { email } });

    // Create new OTP record
    await EmailVerification.create({
      email,
      otp,
      expiresAt,
      isVerified: false,
      attempts: 0
    });

    // Send OTP email
    console.log('Attempting to send OTP to:', email);
    await sendOTPEmail(email, otp);
    console.log('OTP sent successfully to:', email);

    res.json({ 
      message: 'OTP sent successfully to your email',
      email 
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('Email service error:', error.response);
    }
    res.status(500).json({ 
      error: 'Failed to send OTP. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Find OTP record
    const verification = await EmailVerification.findOne({
      where: { email, isVerified: false }
    });

    if (!verification) {
      return res.status(400).json({ error: 'No OTP found for this email' });
    }

    // Check if OTP expired
    if (new Date() > verification.expiresAt) {
      await verification.destroy();
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts
    if (verification.attempts >= 3) {
      await verification.destroy();
      return res.status(400).json({ error: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (verification.otp !== otp) {
      verification.attempts += 1;
      await verification.save();
      return res.status(400).json({ 
        error: 'Invalid OTP',
        attemptsLeft: 3 - verification.attempts
      });
    }

    // Mark as verified
    verification.isVerified = true;
    await verification.save();

    res.json({ 
      message: 'Email verified successfully',
      email,
      verified: true
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Delete existing OTP
    await EmailVerification.destroy({ where: { email } });

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create new OTP record
    await EmailVerification.create({
      email,
      otp,
      expiresAt,
      isVerified: false,
      attempts: 0
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.json({ 
      message: 'New OTP sent successfully',
      email 
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
};

// Check if email is verified
exports.checkVerification = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const verification = await EmailVerification.findOne({
      where: { email, isVerified: true }
    });

    res.json({ 
      verified: !!verification,
      email 
    });
  } catch (error) {
    console.error('Error checking verification:', error);
    res.status(500).json({ error: 'Failed to check verification status' });
  }
};
