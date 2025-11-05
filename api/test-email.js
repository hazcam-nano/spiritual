// api/test-email.js

import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined in environment variables');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const msg = {
    to: 'henrycvalk@gmail.com', // ✅ Use a real inbox
    from: 'sales@hazcam.io',    // ✅ This must be verified in SendGrid
    subject: '✅ Vercel SendGrid Test',
    text: 'Testing SendGrid via Vercel API route.',
    html: '<strong>This is a test email from your Vercel function.</strong>',
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Email sending error:', error.response?.body || error);
    res.status(500).json({
      success: false,
      error: error.response?.body || error.message,
    });
  }
}
