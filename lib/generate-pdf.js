// ============================================================================
// generate-pdf.js
// ============================================================================
// Genera el PDF oficial del reporte de inspección utilizando el componente
// pdf-document.jsx. El resultado se utiliza para:
// - Subir el archivo a Supabase Storage
// - Adjuntar en correos automáticos
// - Descarga directa desde el navegador
//
// Parámetros:
// - reportData (required)
//
// Ejemplo:
//   const pdfBytes = await generatePdf(reportData);
// ============================================================================

import { createPdfDocument } from "./pdf-document";

export async function generatePdf(reportData) {
  // 🔎 Validación
  if (!reportData) {
    console.error("❌ Missing reportData in generatePdf()");
    return { error: "Missing report data" };
  }

  try {
    // 📝 Crea el documento PDF usando el motor react-pdf
    const pdf = await createPdfDocument(reportData);

    // 📤 Devuelve el PDF como Uint8Array listo para subir o enviar por email
    return await pdf.save();
  } catch (err) {
    console.error("❌ Error generating PDF:", err);
    return { error: err.message || "Error generating PDF" };
  }
}

export default generatePdf;
