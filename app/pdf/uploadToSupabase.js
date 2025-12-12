// app/pdf/uploadToSupabase.js
import { createClient } from "@supabase/supabase-js";

/**
 * Uploads a PDF Blob to Supabase Storage (bucket: "reports").
 * Output:
 *  {
 *    ok: boolean,
 *    url?: string,     // Public download URL
 *    path?: string,    // Storage path
 *    error?: string
 *  }
 */
export async function uploadToSupabase({ pdfBlob, propertyId }) {
  try {
    // -------------------------------------------------------------
    // VALIDACIÓN PROFESIONAL
    // -------------------------------------------------------------
    if (!pdfBlob) throw new Error("Missing PDF Blob.");
    if (!propertyId) throw new Error("Missing propertyId.");

    // -------------------------------------------------------------
    // CLIENTE SUPABASE
    // -------------------------------------------------------------
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );

    // -------------------------------------------------------------
    // GENERAR PATH PREMIUM (CONSISTENTE)
    // reports/{propertyId}/inspection-{yyyy-mm-dd_hh-mm-ss}.pdf
    // -------------------------------------------------------------
    const timestamp = new Date().toISOString().replace(/[:]/g, "-");
    const filePath = `${propertyId}/inspection-${timestamp}.pdf`;

    // -------------------------------------------------------------
    // SUBIR PDF
    // -------------------------------------------------------------
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("reports")
      .upload(filePath, pdfBlob, {
        upsert: false,
        contentType: "application/pdf",
        cacheControl: "3600",
      });

    if (uploadError) throw uploadError;

    // -------------------------------------------------------------
    // GENERAR URL PÚBLICA PROFESIONAL
    // -------------------------------------------------------------
    const { data: publicData, error: urlError } = supabase.storage
      .from("reports")
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    const publicUrl = publicData.publicUrl;

    // -------------------------------------------------------------
    // RESPUESTA ESTÁNDAR MARRIOTT
    // -------------------------------------------------------------
    return {
      ok: true,
      url: publicUrl,
      path: filePath,
    };
  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    return {
      ok: false,
      error: err.message || "Unknown upload error",
    };
  }
}
