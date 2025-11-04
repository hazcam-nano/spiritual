import formidable from "formidable";
import fs from "fs/promises";
import { createPDFReport } from "./utils/generatePdf.js";
import { sendEmail } from "./utils/sendEmail.js";
import { verifyCaptcha } from "./utils/verifyCaptcha.js";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Form parsing failed" });

    const token = fields["h-captcha-response"];
    if (!(await verifyCaptcha(token))) {
      return res.status(403).json({ error: "hCaptcha verification failed" });
    }

    const { email, name, birthdate, birthtime, birthcity, birthstate, birthcountry } = fields;
    const palmImage = files.palmImage;

    // Generate summaries (stubbed logic)
    const astrologySummary = `🪐 Sun in Scorpio, Moon in Pisces — Emotional, deep thinker.`;
    const numerologySummary = `🔢 Life Path: 7 — Seeker, philosopher. Soul Urge: 5 — Freedom-lover.`;
    const palmSummary = `✋ Long fate line, deep heart line — indicates emotional depth, travel lines visible.`;

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

    await sendEmail(email, "🔮 Your Full Spiritual Report", "See attached PDF for detailed analysis.", pdfBuffer);

    return res.status(200).json({
      astrologySummary,
      numerologySummary,
      palmSummary
    });
  });
}
