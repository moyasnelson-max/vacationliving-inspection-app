// ============================================================================
// issues-create.js — VERSIÓN PRO DEFINITIVA
// Mantiene el sistema EXACTO que ya usa tu app, sin romper nada.
// Incluye:
//  - temp_report_group
//  - severity
//  - media_urls
//  - timestamps
//  - Tabla correcta: issues_v3
//  - Comentarios Marriott premium
// ============================================================================

"use client";

import supabase from "@/lib/supabaseClient";
import { getOrCreateTempReportGroup } from "./temp-report";

/**
 * Crea un nuevo Issue dentro de la tabla issues_v3.
 * Conserva TODA la estructura avanzada que tu sistema ya usa.
 *
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export async function createIssue({
  houseId,
  inspectorId,
  categoryId,
  subcategoryId,
  itemId,
  description,
  mediaUrls = [],
  severity = null,
}) {
  try {
    // =========================================================================
    // VALIDACIONES MÍNIMAS
    // =========================================================================
    if (!houseId || !inspectorId || !categoryId || !itemId) {
      console.error("❌ Falta un campo obligatorio en createIssue()");
      return { error: "Missing required fields" };
    }

    // =========================================================================
    // GRUPO TEMPORAL — NO SE TOCA TU SISTEMA
    // =========================================================================
    const tempGroup = await getOrCreateTempReportGroup();

    // =========================================================================
    // PAYLOAD COMPLETO — RESPETA TU LÓGICA ORIGINAL
    // =========================================================================
    const payload = {
      house_id: houseId,
      inspector_id: inspectorId,
      category_id: categoryId,
      subcategory_id: subcategoryId || null,
      item_id: itemId,
      description: description || "",
      media_urls: mediaUrls,
      temp_report_group: tempGroup,
      severity: severity, // puedes enviarlo null si tu BD lo permite
      status: "pending",
      created_at: new Date().toISOString(),
    };

    console.log("🟩 Payload createIssue()", payload);

    // =========================================================================
    // INSERTAR EN issues_v3 (TABLA CORRECTA)
    // =========================================================================
    const { data, error } = await supabase
      .from("issues_v3")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("❌ Error insertando issue en issues_v3:", error);
      throw new Error("No se pudo crear el issue");
    }

    // =========================================================================
    // ÉXITO
    // =========================================================================
    return { ok: true, issue: data };
  } catch (err) {
    console.error("❌ createIssue() — Internal Error:", err);
    return { error: err.message || "Unknown error" };
  }
}

export default createIssue;
