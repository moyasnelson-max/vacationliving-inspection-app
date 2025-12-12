// ============================================================================
// fetch-items.js
// ============================================================================
// Obtiene todos los ítems pertenecientes a una categoría específica dentro
// del sistema de inspecciones de Vacation Living.
//
// Parámetros:
// - categoryId (required)
//
// Ejemplo:
//   const items = await fetchItems(5);
//
// Retorna:
// - data[]  → Lista de ítems asociados
// - { error } → Si ocurre algún problema
// ============================================================================

import supabase from "./supabaseClient";

export async function fetchItems(categoryId) {
  // 🔎 Validación inicial
  if (!categoryId) {
    console.error("❌ Missing categoryId in fetchItems()");
    return { error: "Missing categoryId" };
  }

  try {
    // 📥 Consulta ordenada (importante para la UI)
    const { data, error } = await supabase
      .from("inspection_items")
      .select("*")
      .eq("category_id", categoryId)
      .order("order_index", { ascending: true });

    // ❌ Manejo de error Supabase
    if (error) {
      console.error("❌ Error fetching items:", error);
      return { error };
    }

    // 📤 Respuesta final
    return data;
  } catch (err) {
    console.error("❌ Unexpected error in fetchItems():", err);
    return { error: err.message || "Unexpected error" };
  }
}

export default fetchItems;
