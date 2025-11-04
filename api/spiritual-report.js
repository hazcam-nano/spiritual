import formidable from "formidable";
import fs from "fs/promises";
import { verifyCaptcha } from "./utils/verifyCaptcha.js";
import { sendEmail } from "./utils/sendEmail.js";
import { createPDFReport } from "./utils/generatePdf.js";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  // ✅ Handle OPTIONS preflight request for CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // ✅ Allow only POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ✅ CORS header for POST
  res.setHeader("Access-Control-Allow-Origin", "*");

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    const token = fields["h-captcha-response"];
    if (!(await verifyCaptcha(token))) {
      return res.status(403).json({ error: "hCaptcha verification failed" });
    }

    const {
      email,
      name,
      birthdate,
      birthtime,
      birthcity,
      birthstate,
      birthcountry
    } = fields;

    const palmImage = files.palmImage;

    // TEMPORARY: Replace with real logic later
    const astrologySummary = "Sun in Leo, Moon in Scorpio – Intense and passionate.";
    const numerologySummary = "Life Path 6 – Nurturer. Soul Urge 3 – Creative soul.";
    const palmSummary = "Strong heart line, travel marks, 2 child lines, long life line.";

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

    await sendEmail(
      email,
      "🔮 Your Full Spiritual Report",
      "See attached PDF for your full astrology, numerology, and palm reading report.",
      pdfBuffer
    );

    return res.status(200).json({
      astrologySummary,
      numerologySummary,
      palmSummary
    });
  });
}
