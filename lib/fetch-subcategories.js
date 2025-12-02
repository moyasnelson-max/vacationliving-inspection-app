import { supabase } from "./supabase-client.js";

export async function fetchSubcategories(categoryId) {
  const { data, error } = await supabase
    .from("inspection_subcategories")
    .select("*")
    .eq("category_id", categoryId);

  if (error) throw error;
  return data;
}