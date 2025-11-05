import PDFDocument from 'pdfkit';
import getStream from 'get-stream'; // This assumes you've already installed it

export async function generatePdfBuffer({ fullName, birthdate, birthTime, birthPlace, reading }) {
  const doc = new PDFDocument();
  
  doc.fontSize(18).text("🧘 Spiritual Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Name: ${fullName || "Not provided"}`);
  doc.text(`Birth Date: ${birthdate || "Not provided"}`);
  doc.text(`Birth Time: ${birthTime || "Not provided"}`);
  doc.text(`Birth Place: ${birthPlace || "Not provided"}`);
  doc.moveDown();
  doc.text("🌀 Insights:", { underline: true });
  doc.moveDown();

  doc.text(reading || "No insights provided", {
    lineGap: 4
  });

  doc.end();

  // Convert PDF stream to buffer using get-stream
  const buffer = await getStream.buffer(doc);
  return buffer;
}
