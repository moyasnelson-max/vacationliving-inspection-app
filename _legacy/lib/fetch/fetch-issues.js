// ============================================================================
// fetch-issues.js
// ============================================================================
// 📌 Obtiene todos los issues registrados para una inspección específica.
// 📌 Usa la Edge Function: "list-issues"
//
// Parámetros:
// - houseId (required)
// - inspectionId (required)
//
// Ejemplo:
// const issues = await fetchIssues(12, 44);
//
// Retorna:
// - Lista de issues asociados a esa inspección
// - { error } si ocurre un problema
// ============================================================================

import supabase from "./supabaseClient";

export async function fetchIssues(houseId, inspectionId) {
  // ----------------------------
  // Validación inicial
  // ----------------------------
  if (!houseId || !inspectionId) {
    console.error("❌ Missing houseId or inspectionId in fetchIssues()");
    return { error: "houseId and inspectionId required" };
  }

  // ----------------------------
  // Invocar Edge Function
  // ----------------------------
  const { data, error } = await supabase.functions.invoke("list-issues", {
    body: {
      houseId,
      inspectionId,
    },
  });

  if (error) {
    console.error("❌ Error fetching issues:", error);
    return { error };
  }

  return data;
}

export default fetchIssues;
