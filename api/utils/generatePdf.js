import PDFDocument from "pdfkit";
import getStream from "get-stream";

export async function createPDFReport(data) {
  const doc = new PDFDocument();
  doc.fontSize(16).text("🧘 Full Spiritual Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Name: ${data.name}`);
  doc.text(`Email: ${data.email}`);
  doc.text(`DOB: ${data.birthdate}`);
  doc.text(`Time: ${data.birthtime}`);
  doc.text(`Place: ${data.birthcity}, ${data.birthstate}, ${data.birthcountry}`);
  doc.moveDown();

  // Astrology Table
  doc.text("🪐 Astrology Summary", { underline: true });
  doc.text(data.astrologySummary);
  doc.moveDown();

  // Numerology Table
  doc.text("🔢 Numerology Summary", { underline: true });
  doc.text(data.numerologySummary);
  doc.moveDown();

  // Palmistry Table
  doc.text("✋ Palm Reading Summary", { underline: true });
  doc.text(data.palmSummary);
  doc.moveDown();

  // Combined Summary
  doc.fontSize(14).text("🔮 Summary", { underline: true });
  doc.fontSize(12).text("Key Numerology: Life Path 7, Soul Urge 5");
  doc.text("Key Astrology: Sun Scorpio, Emotional Moon");
  doc.text("Key Palmistry: Travel lines, 2 children, long life line");

  doc.end();
  return await getStream.buffer(doc);
}
