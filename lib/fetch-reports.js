// ============================================================================
// fetch-reports.js
// ============================================================================
// Obtiene todos los reportes PDF generados para una propiedad dentro del
// sistema de inspecciones. Ideal para dashboards, historial y pantallas
// de descarga.
//
// Parámetros:
// - houseId (required)
//
// Ejemplo:
//   const reports = await fetchReports(12);
//
// Retorna:
// - data[]  → Lista de reportes ordenados por fecha (últimos primero)
// - { error } → Si ocurre algún problema
// ============================================================================

import supabase from "./supabaseClient";

export async function fetchReports(houseId) {
  // 🔎 Validación inicial
  if (!houseId) {
    console.error("❌ Missing houseId in fetchReports()");
    return { error: "Missing houseId" };
  }

  try {
    // 📥 Obtener lista de reportes ordenados DESC (más recientes primero)
    const { data, error } = await supabase
      .from("inspection_reports")
      .select("*")
      .eq("house_id", houseId)
      .order("created_at", { ascending: false });

    // ❌ Manejo de error de Supabase
    if (error) {
      console.error("❌ Error fetching reports:", error);
      return { error };
    }

    // 📤 Entrega final
    return data;
  } catch (err) {
    console.error("❌ Unexpected error in fetchReports():", err);
    return { error: err.message || "Unexpected error" };
  }
}

export default fetchReports;
