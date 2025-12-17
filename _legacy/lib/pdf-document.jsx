// -----------------------------------------------------------------------------
// pdf-document.jsx (Versión PRO - Mantiene tu lógica original)
// -----------------------------------------------------------------------------
// - Compatible con jsPDF
// - Mantiene tu estructura pero mejora organización y robustez
// - Preparado para añadir QR, health score, media, etc.
// -----------------------------------------------------------------------------

import jsPDF from "jspdf";

/**
 * Genera un documento PDF basado en un reporte completo.
 * Mantiene la estructura original pero optimiza estilo y confiabilidad.
 *
 * @param {Object} report
 * @returns {jsPDF}
 */
export function createPdfDocument(report) {
  const doc = new jsPDF();

  // ---------------------------------------------------------------------------
  // TITULO PRINCIPAL
  // ---------------------------------------------------------------------------
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Vacation Living - Inspection Report", 20, 20);

  // ---------------------------------------------------------------------------
  // DATOS DE CABECERA
  // ---------------------------------------------------------------------------
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  doc.text(`Property: ${report.house || "N/A"}`, 20, 35);
  doc.text(`Inspector: ${report.inspector || "N/A"}`, 20, 45);
  doc.text(`Date: ${report.date || "N/A"}`, 20, 55);

  // ---------------------------------------------------------------------------
  // LISTA DE ITEMS
  // ---------------------------------------------------------------------------
  let offset = 75;
  const items = report.items || [];

  items.forEach((item, i) => {
    const line = `${i + 1}. ${item.name || "Unnamed"} — ${item.status || "N/A"}`;
    doc.text(line, 20, offset);
    offset += 10;
  });

  // ---------------------------------------------------------------------------
  // (Opcional) Aquí luego podemos agregar QR, score, medias, etc.
  // ---------------------------------------------------------------------------

  return doc;
}
