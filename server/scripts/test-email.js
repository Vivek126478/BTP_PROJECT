const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function testEmail() {
  console.log('Testing email configuration...\n');
  
  console.log('Configuration:');
  console.log('- EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('- EMAIL_PORT:', process.env.EMAIL_PORT);
  console.log('- EMAIL_USER:', process.env.EMAIL_USER);
  console.log('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET');
  console.log();

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ EMAIL_USER or EMAIL_PASSWORD not set in .env file');
    console.log('\nPlease check GMAIL_SETUP.md for instructions.');
    process.exit(1);
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ Email configuration is valid!\n');

    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Campus Wheels Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email - Campus Wheels',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4F46E5;">Email Configuration Test</h2>
          <p>If you're reading this, your email configuration is working correctly!</p>
          <p><strong>Configuration Details:</strong></p>
          <ul>
            <li>Host: ${process.env.EMAIL_HOST}</li>
            <li>Port: ${process.env.EMAIL_PORT}</li>
            <li>User: ${process.env.EMAIL_USER}</li>
          </ul>
          <p>You can now use email verification in Campus Wheels.</p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nCheck your inbox:', process.env.EMAIL_USER);
    console.log('\n🎉 Email configuration is working perfectly!');
  } catch (error) {
    console.error('❌ Email configuration test failed:', error.message);
    console.log('\nCommon issues:');
    console.log('1. Using regular Gmail password instead of App Password');
    console.log('2. 2-Step Verification not enabled');
    console.log('3. Incorrect EMAIL_USER or EMAIL_PASSWORD');
    console.log('\nPlease check GMAIL_SETUP.md for detailed instructions.');
    process.exit(1);
  }
}

testEmail();
