// ============================================================================
// fetch-inspection.js
// ============================================================================
// 📌 Obtiene la inspección ACTIVA de una propiedad específica.
// 📌 Usa la Edge Function: "get-inspection"
//
// Parámetros:
// - houseId (required)
//
// Ejemplo:
// const inspection = await fetchInspection(12);
//
// Retorna:
// - Datos completos de la inspección en curso
// - { error } si hay una falla
// ============================================================================

import supabase from "./supabaseClient";

export async function fetchInspection(houseId) {
  // ----------------------------
  // Validación inicial
  // ----------------------------
  if (!houseId) {
    console.error("❌ Missing houseId in fetchInspection()");
    return { error: "Missing houseId" };
  }

  // ----------------------------
  // Llamar Edge Function
  // ----------------------------
  const { data, error } = await supabase.functions.invoke("get-inspection", {
    body: { houseId },
  });

  if (error) {
    console.error("❌ Error fetching inspection:", error);
    return { error };
  }

  return data;
}

export default fetchInspection;
