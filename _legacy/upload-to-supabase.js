// -----------------------------------------------------------------------------
// upload-to-supabase.js — Subida de archivos a Supabase Storage
// -----------------------------------------------------------------------------
//
// Propósito:
//   Subir imágenes, videos o archivos PDF al bucket `reports`.
//   Incluye validaciones, manejo profesional de errores y claridad total.
//
// Marriott Level Features:
//   ✓ Validación de entrada (path + fileBlob)
//   ✓ Manejo elegante de errores con contexto
//   ✓ Reportes claros para debugging
//   ✓ Código estable, limpio y reutilizable
//   ✓ Compatible con tu flujo actual de issues y reportes
//
// -----------------------------------------------------------------------------

import supabase from "@/lib/supabaseClient";

/**
 * Sube un archivo al bucket `reports`.
 *
 * @param {string} path - Ruta completa dentro del bucket (ej: "house_12/img_001.jpg")
 * @param {Blob|File} fileBlob - Archivo a subir
 * @returns {Promise<Object>} - Resultado de Supabase o error estructurado
 */
export async function uploadFile(path, fileBlob) {
  try {
    // ---------------- VALIDACIONES ----------------
    if (!path || typeof path !== "string") {
      throw new Error("Invalid path: path must be a non-empty string.");
    }

    if (!fileBlob) {
      throw new Error("Invalid file: fileBlob is required.");
    }

    // ---------------- SUBIDA A SUPABASE ----------------
    const { data, error } = await supabase.storage
      .from("reports")
      .upload(path, fileBlob, {
        upsert: true, // permite sobrescribir si existe
        contentType: fileBlob.type || "application/octet-stream",
      });

    // ---------------- MANEJO DE ERRORES ----------------
    if (error) {
      console.error("❌ Error uploading file to Supabase:", {
        path,
        message: error.message,
        details: error,
      });
      throw new Error("Upload failed: " + error.message);
    }

    // ---------------- ÉXITO ----------------
    return {
      ok: true,
      path,
      data,
      url: `${supabase.storageUrl}/reports/${path}`,
    };
  } catch (err) {
    console.error("❌ uploadFile() Internal Error:", err);
    return {
      ok: false,
      error: err.message || "Unknown upload error",
    };
  }
}

export default uploadFile;
