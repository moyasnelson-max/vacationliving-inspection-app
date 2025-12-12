// ============================================================================
// fetch-history.js
// ============================================================================
// 📌 Obtener el historial completo de inspecciones para una propiedad.
// 📌 Permite filtros opcionales (fecha y estado).
//
// Parámetros:
// - houseId  (required)
// - fromDate (optional)
// - toDate   (optional)
// - status   (optional → "open" | "closed")
//
// Ejemplo:
// await fetchHistory({ houseId: 12, status: "closed" });
//
// Retorna:
// - data[]  → Lista de inspecciones históricas filtradas
// - { error } si ocurre un problema
// ============================================================================

import supabase from "./supabaseClient";

export async function fetchHistory({ houseId, fromDate, toDate, status }) {
  // ----------------------------
  // Validación inicial
  // ----------------------------
  if (!houseId) {
    console.error("❌ Missing houseId in fetchHistory()");
    return { error: "Missing houseId" };
  }

  // ----------------------------
  // Crear cuerpo para la Edge Function
  // ----------------------------
  const body = {
    houseId,
    fromDate: fromDate || null,
    toDate: toDate || null,
    status: status || null,
  };

  // ----------------------------
  // Llamar Edge Function list-reports
  // ----------------------------
  const { data, error } = await supabase.functions.invoke("list-reports", {
    body,
  });

  if (error) {
    console.error("❌ Error fetching history:", error);
    return { error };
  }

  return data;
}

export default fetchHistory;
