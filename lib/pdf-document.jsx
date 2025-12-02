import { jsPDF } from "jspdf";

export function createPdfDocument(report) {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold");
  doc.text("Inspection Report", 20, 20);

  doc.setFont("Helvetica", "normal");
  doc.text(`House: ${report.houseName}`, 20, 35);
  doc.text(`Inspector: ${report.inspector}`, 20, 45);
  doc.text(`Date: ${report.date}`, 20, 55);

  report.items.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.name} – ${item.status}`, 20, 75 + index * 10);
  });

  return doc;
}