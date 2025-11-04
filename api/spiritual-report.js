import formidable from "formidable";
import fs from "fs/promises";
import { verifyCaptcha } from "./utils/verifyCaptcha.js";
import { sendEmail } from "./utils/sendEmail.js";
import { createPDFReport } from "./utils/generatePdf.js";

export const config = {
  api: { bodyParser: false },
};

// ✅ Universal CORS helper
function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  // --- Handle preflight ---
  if (req.method === "OPTIONS") {
    setCors(res);
    return res.status(200).end();
  }

  // --- Only accept POST ---
  if (req.method !== "POST") {
    setCors(res);
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // --- Enable CORS for actual POST request ---
  setCors(res);

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    const token = fields["h-captcha-response"];
    const email = fields.email;

    // --- Verify Captcha ---
    if (!token || !(await verifyCaptcha(token))) {
      console.warn("Captcha failed or missing token");
      return res.status(403).json({ error: "hCaptcha verification failed" });
    }

    // --- Extract form data ---
    const {
      name,
      birthdate,
      birthtime,
      birthcity,
      birthstate,
      birthcountry
    } = fields;

    // --- Temporary summaries ---
    const astrologySummary = "☀️ Sun in Leo, Moon in Cancer – Balanced intuition and leadership.";
    const numerologySummary = "🔢 Life Path 6 – Nurturing, responsible, and harmonious.";
    const palmSummary = "✋ Clear heart line, steady fate line, and signs of travel and family growth.";

    try {
      // --- Generate PDF ---
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
        palmSummary
      });

      // --- Send Email ---
      await sendEmail(
        email,
        "🧘 Your Complete Spiritual Report",
        "Your astrology, numerology, and palm reading report is attached.",
        pdfBuffer
      );

      // --- Respond with summaries ---
      return res.status(200).json({
        astrologySummary,
        numerologySummary,
        palmSummary
      });
    } catch (e) {
      console.error("Server error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}
