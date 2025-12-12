// ============================================================================
// fetch-subcategories.js
// ============================================================================
// Obtiene todas las subcategorías pertenecientes a una categoría específica
// dentro del sistema de inspecciones.
//
// Parámetros:
// - categoryId (required)
//
// Ejemplo:
//   const subs = await fetchSubcategories(7);
//
// Retorna:
// - data[]  → Lista de subcategorías (orden visual)
// - { error } → Si ocurre algún problema
// ============================================================================

import supabase from "./supabaseClient";

export async function fetchSubcategories(categoryId) {
  // 🔎 Validación
  if (!categoryId) {
    console.error("❌ Missing categoryId in fetchSubcategories()");
    return { error: "Missing categoryId" };
  }

  try {
    // 📥 Consulta a Supabase ordenada por índice visual
    const { data, error } = await supabase
      .from("inspection_subcategories")
      .select("*")
      .eq("category_id", categoryId)
      .order("order_index", { ascending: true });

    // ❌ Manejo de error
    if (error) {
      console.error("❌ Error fetching subcategories:", error);
      return { error };
    }

    // 📤 Devuelve data final
    return data;
  } catch (err) {
    console.error("❌ Unexpected error in fetchSubcategories():", err);
    return { error: err.message || "Unexpected error" };
  }
}

export default fetchSubcategories;
