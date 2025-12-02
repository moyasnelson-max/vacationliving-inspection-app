import { createPdfDocument } from "./pdf-document.jsx";

export async function generatePDF(reportData) {
  const pdf = await createPdfDocument(reportData);
  return pdf.save(); // devuelve Uint8Array listo para subir al storage
}