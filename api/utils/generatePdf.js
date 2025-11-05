import PDFDocument from "pdfkit";
import getStream from "get-stream";

export async function createPDFReport({
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
}) {
  const getStream = require("get-stream");
  const doc = new PDFDocument();
  doc.fontSize(20).text("🧘 Full Spiritual Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`📛 Name: ${name}`);
  doc.text(`📧 Email: ${email}`);
  doc.text(`📅 DOB: ${birthdate}`);
  doc.text(`⏰ Time: ${birthtime || 'Not provided'}`);
  doc.text(`🌍 Place: ${birthcity}, ${birthstate}, ${birthcountry}`);
  doc.moveDown();

  doc.fontSize(14).text("🪐 Astrology Summary", { underline: true });
  doc.fontSize(12).text(astrologySummary);
  doc.moveDown();

  doc.fontSize(14).text("🔢 Numerology Summary", { underline: true });
  doc.fontSize(12).text(numerologySummary);
  doc.moveDown();

  doc.fontSize(14).text("✋ Palm Reading Summary", { underline: true });
  doc.fontSize(12).text(palmSummary);
  doc.moveDown();

  doc.fontSize(14).text("🔮 Final Summary", { underline: true });
  doc.fontSize(12).text("Key Astrology Insight: Sun Leo, Gemini Rising");
  doc.text("Key Numerology: Life Path 3, Soul Urge 5");
  doc.text("Palm Reading: Strong fate line, travel lines, 2 children lines");
  doc.end();

  return await getStream.buffer(doc);
}
