import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(to, subject, text, pdfBuffer) {
  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      text,
      html: `<p>${text}</p>`,
      attachments: [
        {
          content: pdfBuffer.toString("base64"),
          filename: "spiritual-report.pdf",
          type: "application/pdf",
          disposition: "attachment"
        }
      ]
    });
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message);
    throw new Error("Email failed to send.");
  }
}
