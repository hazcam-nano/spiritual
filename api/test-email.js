import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  const msg = {
    to: 'sales@hazcam.io',
    from: 'sales@hazcam.io',
    subject: '✅ Vercel SendGrid Test',
    text: 'Testing SendGrid via API route on Vercel.',
    html: '<strong>This is a Vercel + SendGrid email test</strong>',
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('❌ Email sending error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

