// utils/sendEmail.js
// utils/sendEmail.js
// utils/sendEmail.js
// utils/sendEmail.js
// utils/sendEmail.js

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email with optional PDF attachment
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {Buffer} [options.buffer] - Optional PDF buffer
 * @param {string} [options.filename] - Optional filename for attachment
 */
export async function sendEmailWithAttachment({ to, subject, html, buffer, filename }) {
  const msg = {
    to,
    from: 'sales@hazcam.io', // ✅ Make sure this is a verified sender in SendGrid
    subject,
    html,
  };

  if (buffer && filename) {
    msg.attachments = [
      {
        content: buffer.toString('base64'),
        filename,
        type: 'application/pdf',
        disposition: 'attachment',
      },
    ];
  }

  await sgMail.send(msg);
}
