// ============================================================================
// fetch-categories.js
// ----------------------------------------------------------------------------
// Obtiene todas las categorías de inspección asociadas a una propiedad.
//
// Parámetros:
//   - houseId (required)  → ID de la propiedad.
//
// Retorna:
//   - { data: [] }  → Lista de categorías ordenadas.
//   - { error }     → Si ocurre una falla.
//
// Uso:
//   const categories = await fetchCategories(houseId);
// ============================================================================

import supabase from "./supabaseClient";

export async function fetchCategories(houseId) {
  if (!houseId) {
    console.error("❌ Missing houseId in fetchCategories()");
    return { error: "Missing houseId" };
  }

  const { data, error } = await supabase
    .from("inspection_categories")
    .select("*")
    .eq("house_id", houseId)
    .order("order_index", { ascending: true }); // Mantiene el orden visual

  if (error) {
    console.error("❌ Error fetching categories:", error);
    return { error };
  }

  return data;
}

export default fetchCategories;
