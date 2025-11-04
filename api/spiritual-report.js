import formidable from "formidable";
import fs from "fs/promises";
import { verifyCaptcha } from "./utils/verifyCaptcha.js";
import { sendEmail } from "./utils/sendEmail.js";
import { createPDFReport } from "./utils/generatePdf.js";

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // ✅ Step 1: Handle preflight request
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  // ✅ Step 2: Only accept POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ✅ Step 3: Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    const token = fields["h-captcha-response"];
    if (!token || !(await verifyCaptcha(token))) {
      return res.status(403).json({ error: "hCaptcha verification failed" });
    }

    const {
      email,
      name,
      birthdate,
      birthtime,
      birthcity,
      birthstate,
      birthcountry,
    } = fields;

    const palmImage = files.palmImage;

    // For now, mock the summaries
    const astrologySummary = "🌞 Sun in Leo, Moon in Aries.";
    const numerologySummary = "🔢 Life Path 7 – seeker of truth.";
    const palmSummary = "🖐️ Strong fate line, travel lines visible, 2 child lines.";

    // Create PDF report
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

    // Send email with PDF
    await sendEmail(
      email,
      "🧘 Your Spiritual Report is Ready",
      "Attached is your personal astrology, numerology, and palm reading report.",
      pdfBuffer
    );

    // ✅ Step 4: Return JSON response with CORS header
    return res.status(200).json({
      astrologySummary,
      numerologySummary,
      palmSummary,
    });
  });
}
