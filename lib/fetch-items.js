import { supabase } from "./supabase-browser.js";

export async function fetchItems(subcategoryId) {
  const { data, error } = await supabase
    .from("inspection_items")
    .select("*")
    .eq("subcategory_id", subcategoryId);

  if (error) throw error;
  return data;
}