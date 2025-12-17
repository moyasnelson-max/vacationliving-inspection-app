"use client";

import PdfDocument from "./PdfDocument";
import { pdf } from "@react-pdf/renderer";

/**
 * Generate a luxury-grade PDF report for Vacation Living
 * with strong validation & graceful error handling.
 */
export default async function generatePDF({
  propertyName = "",
  inspectorName = "",
  timestamp = "",
  sections = [],
} = {}) {
  try {
    // --- Validate parameters (Marriott grade) ---
    if (!propertyName) throw new Error("Missing propertyName");
    if (!inspectorName) throw new Error("Missing inspectorName");
    if (!timestamp) throw new Error("Missing timestamp");
    if (!Array.isArray(sections)) throw new Error("Sections must be an array");

    // --- Build PDF Document ---
    const document = (
      <PdfDocument
        propertyName={propertyName}
        inspectorName={inspectorName}
        timestamp={timestamp}
        sections={sections}
      />
    );

    // --- Generate Blob ---
    const blob = await pdf(document).toBlob();

    if (!blob) throw new Error("Failed to generate PDF blob");

    return blob;
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    throw error;
  }
}
