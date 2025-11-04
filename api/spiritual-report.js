// -------- spiritual-report.js --------
// Serverless function for Vercel that handles the Shopify form submission
// Adds full CORS support + handles POST and OPTIONS requests.

const formidable = require("formidable");
const fs = require("fs/promises");
const { verifyCaptcha } = require("../utils/verifyCaptcha");
const { sendEmail } = require("../utils/sendEmail");
const { createPDFReport } = require("../utils/generatePdf");

module.exports = async (req, res) => {
  // ✅ 1. Always set CORS headers first
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ 2. Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ 3. Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ✅ 4. Parse multipart form (for image upload)
  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      // include CORS headers again just in case
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(500).json({ error: "Form parsing failed" });
    }

    try {
      const token = fields["h-captcha-response"];
      const email = fields.email;

      // ✅ 5. Verify hCaptcha
      if (!token || !(await verifyCaptcha(token))) {
        return res.status(403).json({ error: "hCaptcha verification failed" });
      }

      // ✅ 6. Collect user fields
      const {
        name,
        birthdate,
        birthtime,
        birthcity,
        birthstate,
        birthcountry,
      } = fields;

      // ✅ 7. Generate summaries (placeholder logic)
      const astrologySummary = "☀️ Sun in Leo, Moon in Cancer – empathetic leader.";
      const numerologySummary = "🔢 Life Path 6 – responsible, caring, creative.";
      const palmSummary =
        "✋ Clear heart line, strong fate line; indications of travel and balanced relationships.";

      // ✅ 8. Generate PDF buffer
      const pdfBuffer = await createPDFReport({
        name,
        email,
        birthdate,
        birthtime,
        birthcity,
        birthstate,
        birthcountry,
        astrologySummary,
        numerologySummary,
        palmSummary,
      });

      // ✅ 9. Send the email with attached PDF
      await sendEmail(
        email,
        "🧘 Your Spiritual Report",
        "Your full astrology, numerology, and palm reading report is attached.",
        pdfBuffer
      );

      // ✅ 10. Send JSON response back to Shopify form
      res.status(200).json({
        astrologySummary,
        numerologySummary,
        palmSummary,
      });
    } catch (error) {
      console.error("Server error:", error);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

// ✅ 11. Disable Vercel bodyParser for formidable
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
