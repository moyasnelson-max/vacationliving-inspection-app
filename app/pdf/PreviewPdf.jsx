"use client";

import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import PdfDocument from "./PdfDocument";

export default function PreviewPdf({ data }) {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Render & Convert to Blob
  useEffect(() => {
    async function renderPDF() {
      try {
        setLoading(true);
        setError(null);

        const blob = await pdf(<PdfDocument {...data} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);

        setUrl(pdfUrl);
      } catch (err) {
        console.error("Error rendering PDF:", err);
        setError("Hubo un problema generando el PDF.");
      } finally {
        setLoading(false);
      }
    }

    if (data) renderPDF();
  }, [data]);

  /* -------------------------------------------------------------
     LOADER PREMIUM MARRIOTT
  ------------------------------------------------------------- */
  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontSize: "18px",
          color: "#444",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Generando vista previa…
      </div>
    );
  }

  /* -------------------------------------------------------------
     ERROR HANDLING ELEGANTE
  ------------------------------------------------------------- */
  if (error) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#B00020",
          fontSize: "16px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {error}
      </div>
    );
  }

  /* -------------------------------------------------------------
     IFRAME CON PDF — Estilo Marriott
  ------------------------------------------------------------- */
  return (
    <iframe
      src={url}
      style={{
        width: "100%",
        height: "900px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    />
  );
}
