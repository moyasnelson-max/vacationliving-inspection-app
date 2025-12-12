// -----------------------------------------------------------------------------
// email.js — Servicio de envío de reportes por correo (Nivel Marriott Enterprise)
// -----------------------------------------------------------------------------
// Función principal:
//   sendInspectionEmail(reportId)
//
// Descripción:
//   Invoca la Edge Function "send-report" para enviar el reporte final por email
//   a los destinatarios de cada propiedad.
//
// Características Marriott:
//   ✓ Validación elegante del input
//   ✓ Logging profesional para debugging en producción
//   ✓ Manejo robusto de errores
//   ✓ Retorno estándar { success, data, error }
//   ✓ Compatible 100% con tu arquitectura actual
//
// Dependencias:
//   - Edge Function: send-report
//   - RLS configurado en Supabase
// -----------------------------------------------------------------------------

import { supabase } from "@/lib/supabaseClient";

/**
 * Enviar por email el reporte generado
 * @param {string|number} reportId - ID del reporte generado en la DB
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export async function sendInspectionEmail(reportId) {
  // ------------------------------
  // VALIDACIÓN DE PARÁMETROS
  // ------------------------------
  if (!reportId) {
    console.error("❌ Missing reportId in sendInspectionEmail()");
    return { success: false, error: "Missing reportId" };
  }

  try {
    // ------------------------------
    // INVOCACIÓN DE LA EDGE FUNCTION
    // ------------------------------
    const { data, error } = await supabase.functions.invoke("send-report", {
      body: { reportId },
    });

    // Manejo de error interno en la Function
    if (error) {
      console.error("❌ Error sending report email:", error);
      return { success: false, error };
    }

    // ------------------------------
    // RETORNO EXITOSO
    // ------------------------------
    return {
      success: true,
      data,
    };
  } catch (err) {
    // ------------------------------
    // ERRORES DE RED, RUNTIME, STACK
    // ------------------------------
    console.error("🔥 Critical error in sendInspectionEmail():", err);
    return { success: false, error: err };
  }
}
